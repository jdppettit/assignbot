'use strict';

const moment = require('moment');
const N = require('nanotimer');
const A = require('arc-log');

const zendesk = require('./zendesk.js');
const pagerduty = require('./pagerduty.js');
const config = require('../config.js');

const timer = new N();
const log = A.log;

let lastTicketReceived = config.STARTING_TICKET_ID;
let lastCheck = moment().subtract(1, 'days')

export const tick = () => {
  timer.setInterval(getData, '', config.POLL_INTERVAL);
}

export const getData = () => {
  log(`Ticket started at ${moment().format()}`, 'info')
  let user = 'None';
  pagerduty.getOnCall().then(onCall => {
    if (onCall.users.length > 0) {
      user = onCall.users[0].email;
    }
    log(`Determined that user ${user} is on call`, 'info');
    return zendesk.getNewTickets(lastTicketReceived, lastCheck);
  }).then(newTickets => {
    lastCheck = moment()
    if (newTickets.length > 0) {
      lastTicketReceived = newTickets.slice(-1)[0].id
    }
    return zendesk.reassignManyTickets(newTickets, user);
  }).then(() => {
    log('Successfully completed loop', 'info');
  }).catch(err => {
    log('Experienced error', 'error');
    log(err, 'error');
  });
}
