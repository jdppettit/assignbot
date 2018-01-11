'use strict';

const P = require('bluebird');
const moment = require('moment');
const zendesk = require('node-zendesk');

const config = require('../config.js');
const mapper = require('./mapper.js');

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
  const userId = mapper.zendeskMapper[user];
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
        resolve(res);
      });
    });
  }).catch(err => {
    console.log(err);
  })
}

export const getNewTickets = (lastReceived, lastCheck) => {
  return new P((resolve, reject) => {
    zdClient.tickets.list((err, req, res) => {
      if (err) {
        reject(err);
      }
      let tickets = res;
      console.log(`Got ${tickets.length} tickets`);
      return P.map(tickets, ticket => {
        console.log(ticket.updated_at);
        console.log(lastCheck);
        console.log(ticket.updated_at > lastCheck);
        if (
          ticket.id > lastReceived &&
          ticket.update_at >= lastCheck
        ) {
          return ticket;
        }
        return;
      }).then(newTickets => {
        newTickets = newTickets.filter(n => {
          return n != undefined;
        });
        console.log(`After filtering found ${newTickets.length} new tickets`);
        resolve(newTickets)
      }).catch(err => {
        console.log('Failed to pull new tickets');
        console.log(err);
        reject(err);
      });
    });
  });
};
