
require('dotenv').config()

import config from './config'

import { Server } from '@hapi/hapi'

import { log } from './log'

import { join } from 'path'
const Joi = require('joi')

const Pack = require('../package');

import { load } from './handlers'

const handlers = load(join(__dirname, './handlers'))


export async function NewServer(): Promise<Server> {


  const server = new Server({
    host: config.get('host'),
    port: config.get('port'),
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true
        }
      }
    }
  });

  server.ext('onRequest', function(request, h) {

    log.debug('server.request', { id: request.info.id, headers: request.headers })

    if ('application/payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/payment' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/payment';
    }

    if ('application/bitcoinsv-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/bitcoinsv-payment';
    }

    if ('application/dash-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/dash-payment';
    }

    if ('application/dash-payment' === request.headers['accept']) {
      request.headers['accept'] = 'application/json';
      request.headers['x-accept'] = 'application/dash-payment';
    }

    if ('application/dash-paymentack' === request.headers['accept']) {
      request.headers['accept'] = 'application/json';
      request.headers['x-accept'] = 'application/dash-paymentack';
    }

    if ('application/bitcoinsv-paymentack' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/bitcoinsv-payment';
      request.headers['x-accept'] = 'application/bitcoinsv-paymentack';
    }

    if ('application/verify-payment' === request.headers['content-type']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/verify-payment';
    }

    if ('application/verify-payment' === request.headers['accept']) {
      request.headers['content-type'] = 'application/json';
      request.headers['x-content-type'] = 'application/verify-payment';
    }

    return h.continue;
  });

  if (config.get('prometheus_enabled')) {

    log.info('server.metrics.prometheus', { path: '/metrics' })

    const { register: prometheus } = require('./metrics')

    server.route({
      method: 'GET',
      path: '/metrics',
      handler: async (req, h) => {
        return h.response(await prometheus.metrics())
      },
      options: {
        description: 'Prometheus Metrics about Node.js Process & Business-Level Metrics',
        tags: ['api', 'system']
      }
    })

  }

  server.route({
    method: 'GET',
    path: '/api/v1/rewards/new',
    handler: handlers.Rewards.create,
    options: {
      description: 'New Payment Request For Rewards From Token',
      tags: ['api'],
      validate: {
        query: Joi.object({
          token: Joi.string().required(),
          amount: Joi.number().required(),
          currency: Joi.string().required()
        }).label('NewRewardPaymentRequest'),
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          network: Joi.string().required(),
          outputs: Joi.array().items(Joi.object({
            script: Joi.string().required(),
            amount: Joi.number().integer().required()
          }).required().label('PaymentRequestOutput')).required(),
          creationTimestamp: Joi.number().integer().required(),
          expirationTimestamp: Joi.number().integer().required(),
          memo: Joi.string().optional(),
          paymentUrl: Joi.string().required(),
          merchantData: Joi.string().optional()
        })
          
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/api/v1/transactions',
    handler: handlers.Transactions.create,
    options: {
      description: 'Submit new, signed transactions to the network',
      tags: ['api', 'transactions'],
      validate: {
        failAction: 'log',
        payload: Joi.object({
          transaction: Joi.string().required()
        }).label('SubmitTransaction')
      },
      response: {
        failAction: 'log',
        schema: Joi.object({
          payment: Joi.string().required(),
          memo: Joi.string().optional(),
          error: Joi.number().optional()
        }).label('PaymentAck')
      }

    }
  })

  var started = false

  if (started) return;

  started = true

  if (config.get('swagger_enabled')) {

    const swaggerOptions = {
      info: {
        title: 'Midas Valley',
        version: Pack.version,
        description: 'Give Your Token Holders Cash Flow Rewards'
      },
      schemes: ['https'],
      host: 'https://midasvalley.net',
      documentationPath: '/',
      grouping: 'tags'
    }

    const HapiSwagger = require('hapi-swagger');

    const Inert = require('@hapi/inert');

    const Vision = require('@hapi/vision');

    await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
    ]);

  }

  return server
  
}

export async function start() {

  const server = await NewServer();

  await server.start();

  log.info(server.info)

  return server;

}

if (require.main === module) {

  start()

}
