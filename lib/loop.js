'use strict';

const moment = require('moment');
const N = require('nanotimer');

const zendesk = require('./zendesk.js');
const pagerduty = require('./pagerduty.js');
const config = require('../config.js');

const timer = new N();

let lastTicketReceived = config.STARTING_TICKET_ID;
let lastCheck = moment().subtract(1, 'days')

export const tick = () => {
  console.log(`Ticket started at ${moment().format()}`)
  timer.setInterval(getData, [lastTicketReceived, lastCheck], config.POLL_INTERVAL);
}

export const getData = (lastTicket, lastCheck) => {
  let user;
  pagerduty.getOnCall().then(onCall => {
    user = onCall.users[0].email;
    return zendesk.getNewTickets(lastTicket, lastCheck);
  }).then(newTickets => {
    lastCheck = moment.now()
    lastTicketReceived = newTickets.slice(-1)[0].id
    return zendesk.assignManyTickets(newTickets, user);
  }).then(() => {
    console.log('Successfully completed loop.');
  }).catch(err => {
    console.log('Experienced error');
    console.log(err);
  });
}

zendesk.getNewTickets();
