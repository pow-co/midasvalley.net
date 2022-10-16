
require('dotenv').config()

const nconf = require('nconf')

nconf.argv({
  parseValues: true,
  transform
})

nconf.env({
  parseValues: true,
  transform
})

nconf.defaults({
  host: '0.0.0.0',
  port: '5200',
  prometheus_enabled: true,
  http_api_enabled: true,
  swagger_enabled: true,
  postgres_enabled: true,
  amqp_enabled: false,
  loki_enabled: false,
  api_base: 'https://midasvalley.net'
})

export default nconf

function transform(obj) {
  return {
    key: obj.key.toLowerCase(),
    value: obj.value
  }
}

