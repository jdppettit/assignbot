'use strict';

const envvar = require('envvar');

export const ZENDESK_USERNAME = envvar.string('ASSIGN_BOT_ZENDESK_USERNAME');
export const ZENDESK_TOKEN = envvar.string('ASSIGN_BOT_ZENDESK_TOKEN');
export const ZENDESK_URI = envvar.string('ASSIGN_BOT_ZENDESK_URI');

export const PAGERDUTY_TOKEN = envvar.string('ASSIGN_BOT_PAGERDUTY_TOKEN');
export const PAGERDUTY_SCHEDULE_ID = envvar.string('ASSIGN_BOT_PAGERDUTY_SCHEDULE_ID');

export const POLL_INTERVAL = '10s';
export const POLL_TIMEOUT = '200s';

export const STARTING_TICKET_ID = 154;
