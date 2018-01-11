'use strict';

const P = require('bluebird');
const zendesk = require('node-zendesk');

const config = require('../config.js');

const zdClient = zendesk.createClient({
  username: config.ZENDESK_USERNAME,
  token: config.ZENDESK_TOKEN,
  remoteUri: config.ZENDESK_URI
});

zdClient.users.listByGroup((err, req, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});
