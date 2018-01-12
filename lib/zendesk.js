'use strict';

const P = require('bluebird');
const moment = require('moment');
const zendesk = require('node-zendesk');
const A = require('arc-log');

const config = require('../config.js');
const mapper = require('./mapper.js');

const log = A.log;

const zdClient = zendesk.createClient({
  username: config.ZENDESK_USERNAME,
  token: config.ZENDESK_TOKEN,
  remoteUri: config.ZENDESK_URI
});

export const assignTicket = (ticketId, user) => {
  const userId = mapper.zendeskMapper[user];
  return new P((resolve, reject) => {
    zdClient.tickets.update(ticketId, {
      ticket: {
        assignee_id: userId
      }
    }, (err, req, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

export const reassignManyTickets = (tickets, user) => {
  if (!user) {
    log('No user on call, bailing', 'warning');
    P.resolve()
    return;
  }
  const userId = mapper.zendeskMapper[user];
  if (tickets.length == 0) {
    log('No tickets to reassign, bailing', 'warning');
    P.resolve();
    return;
  }
  return P.map(tickets, ticket => {
    return ticket.id;
  }).then(ticketsToUpdate => {
    return new P((resolve, reject) => {
      zdClient.tickets.updateMany(
        ticketsToUpdate, {
        ticket: {
          assignee_id: userId,
        },
      }, (err, req, res) => {
        if (err) {
          reject(err);
        }
        log(`Assigned ${tickets.length} ticket(s) to ${user}`, 'info');
        resolve(res);
      });
    });
  }).catch(err => {
    log('Got error when assigning tickets', 'error');
    log(err, 'error');
  })
}

export const getNewTickets = (lastReceived, lastCheck) => {
  return new P((resolve, reject) => {
    zdClient.tickets.list((err, req, res) => {
      if (err) {
        reject(err);
      }
      let tickets = res;
      log(`Got ${tickets.length} tickets`, 'info');
      return P.map(tickets, ticket => {
        if (
          ticket.id > lastReceived &&
          moment(ticket.update_at) >= lastCheck
        ) {
          return ticket;
        }
        return;
      }).then(newTickets => {
        newTickets = newTickets.filter(n => {
          return n != undefined;
        });
        log(`After filtering found ${newTickets.length} new tickets`, 'info');
        resolve(newTickets)
      }).catch(err => {
        log('Failed to pull new tickets', 'error');
        log(err, 'error');
        reject(err);
      });
    });
  });
};
