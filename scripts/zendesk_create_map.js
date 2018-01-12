'use strict';

const zendesk = require('node-zendesk');
const A = require('arc-log');
const P = require('bluebird');
const fs = require('fs');

const config = require('../config.js');

const zdClient = zendesk.createClient({
  username: config.ZENDESK_USERNAME,
  token: config.ZENDESK_TOKEN,
  remoteUri: config.ZENDESK_URI
});

P.promisifyAll(fs);

const path = './conf/map.js';
const log = A.log;
const error = A.error;

zdClient.users.list((err, req, result) => {
  if (err) {
    log.error('Failed to pull users', err);
  }
  let mapObject = {};
  P.map(result, user => {
    if (user.role != 'end-user') {
      mapObject[user.email] = user.id;
    }
    return;
  }).then(() => {
    log(mapObject, 'info');
    const fileObject = `export const map = ${JSON.stringify(mapObject)}`
    log('Mapping completed', 'info');
    return fs.writeFileAsync(path, fileObject);
  }).then(() => {
    log('Map successfully written to conf/map.js', 'info');
  }).catch(err => {
    error('Experienced error creating map', err);
  });
});
