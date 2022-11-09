;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};




	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	

	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	
	var parallax = function() {

		if ( !isMobile.any() ) {
			$(window).stellar({
				horizontalScrolling: false,
				hideDistantElements: false, 
				responsive: true

			});
		}
	};


	$(function(){
		contentWayPoint();
		
		goToTop();
		loaderPage();
		parallax();
	});

	async function listRevenueAddresses() {

		const { data } = await axios.get('https://onchain.sv/api/v1/events?app=midasvalley.net&type=set_revenue_address&author=1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA')

		for (let event of data.events) {
			console.log('set_revenue_address', event.content)
		}

		const revenueAddresses = data.events.reduce((map, event) => {

			map[event.content.domain] = event.content.address

			return map

		}, {})

		return revenueAddresses
	}

	async function listTokens() {

		const { data } = await axios.get('https://onchain.sv/api/v1/events?app=midasvalley.net&type=set_token')

		for (let event of data.events) {
			console.log('set_token', event.content)
		}

		const tokens = data.events.reduce((map, event) => {

			map[event.author] = event.content

			console.log('reduce', map)

			return map
		}, {})

		return tokens
	}

	(async () => {

		const revenueAddresses = await listRevenueAddresses()

		const tokens = await listTokens()

		console.log('TOKENS', tokens)

		const { data } = await axios.get('https://onchain.sv/api/v1/events?app=midasvalley.net&type=watch_domain&author=1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA')
		let { events } = data

		console.log('EVENTS', events)

		const domains = events.filter(event => {

			return typeof event.content.domain === 'string'

		})

		for (let event of events) {

			console.log("Domain", event.content)
		}

		const templateHTML = document.getElementById('link-list-item-template').innerHTML

		const template = Handlebars.compile(templateHTML)

		events = await Promise.all(domains.reverse().map(async (event) => {

			const { domain } = event.content

			return axios.get(`https://midasvalley.net/api/v1/domains/${domain}/dns-txt-records`).then(({data}) => {

				console.log('midasvalley.domain.data', data)

				return {
					timestamp: luxon.DateTime.fromISO(event.timestamp).toLocaleString(luxon.DateTime.DATETIME_MED),
					domain,
					txid: event.txid,
					data,
					bitcom: data.onchain
				}

			})
			.catch(error => {
				console.log('axios.error', error);
				return null
			})

		}))

		events = events.filter(event => !!event)

		for (let event of events) {

			const html = template(Object.assign(event, {
				revenueAddress: revenueAddresses[event.domain],
				token: tokens[event.bitcom]
			}))

			$('#homepage-links-list').prepend(html)

		}

		$('.boost-button').on('click', event => {

			event.preventDefault()

			console.log('target', event.target)

			const txid = $(event.target).parent('svg').data('txid')

			console.log('txid', txid)

			Snackbar.show({text: `Boosting Post with BoostPow.com for $0.05`, pos: 'bottom-right', actionTextColor: 'red'});

			handleBoost(txid)

		})

	})();


}());

function enqueueSnackbar(text, params) {

	Snackbar.show({text, pos: 'bottom-right', actionTextColor: 'red'});

}

const handleBoost = async (txid) => {

    const value = 0.05;
    const currency = 'USD';

    enqueueSnackbar(`Getting Boostpow Details for ${value} ${currency} of Proof of Work`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    });

    const url = `https://askbitcoin.ai/api/v1/boostpow/${txid}/new?value=${value}&currency=${currency}`;

    console.log('boostpow.job.build', { url });

    let { data } = await axios.get(url);

    console.log('boostpow.payment_request', data);

    enqueueSnackbar(`Posting Boostpow Order: ${txid}`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      },
      variant: 'info'
    });

    const script = new bsv.Script(data.outputs[0].script);

    const amount = data.outputs[0].amount / 100000000;

    try {
      const send = {
        opReturn: [
          'onchain',
          '18pPQigu7j69ioDcUG9dACE1iAN9nCfowr',
          'job',
          JSON.stringify({
            index: 0
          })
        ],
        amount,
        to: script.toASM(),
        currency: 'BSV'
      };

      console.log('relayx.send.params', send);

      const result = await relayone.send(send);

      console.log('relayx.send.result', result);

      console.log('RESULT', result);

      const { txid } = result;

      console.log('TXID', txid);

      // Post the new boostpow job transaction to the indexer API at pow.co
      axios
        .get(`https://pow.co/api/v1/boost/jobs/${txid}`)
        .then(({ data }) => {
          console.log(`pow.co/api/v1/jobs/${result.txid}.result`, data);
         })
        .catch((error) => {
          console.error(`pow.co/api/v1/jobs/${result.txid}`, error);
        });

      axios
        .post(`https://pow.co/api/v1/boost/jobs`, {
          transaction: result.rawTx
        })
        .then(({ data }) => {
          console.log(`post.pow.co/api/v1/jobs.result`, data);
        })
        .catch((error) => {
          console.error(`post.pow.co/api/v1/jobs`, error);
        });

      enqueueSnackbar(`Boostpow Order Posted`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'success'
      });

      enqueueSnackbar(`boostpow.job ${result.txid}`, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        persist: true
      });

      console.log('relay.quote', result);
    } catch (error) {
      console.error('relayx', error);

      enqueueSnackbar(`Error Posting Boostpow Order: ${error.message}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'
      });
    }
}
