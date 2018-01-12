'use strict';

const A = require('arc-log');
const P = require('bluebird');
const zendesk = require('node-zendesk');

const config = require('../config.js');

const zdClient = zendesk.createClient({
  username: config.ZENDESK_USERNAME,
  token: config.ZENDESK_TOKEN,
  remoteUri: config.ZENDESK_URI
});

const log = A.log;

zdClient.users.list((err, req, result) => {
  if (err) {
    log('Got an error pulling users', 'error');
    log(err, 'error');
    return;
  }
  log('Users retrieved successfully', 'info');
  log(result, 'info');
  log(req, 'info');
});
