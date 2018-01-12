# AssignBot

## Purpose

AssignBot will poll a PagerDuty schedule periodically to determine who is on call in your organization. AssignBot will then assign the on call individual all Zendesk tickets until he or she is no longer on call.

## Dependencies

The only notable dependency is Node.js version 6.

If you are curious about the actual node modules, take a look at package.json.

### Security Considerations

This is likely going to be run on premise. To make that process as painless as possible, the application gets all the data it needs. No internal connections are required so no VPN or special network considerations are required.

## Development

1. `cp ./conf/env.example ./conf/env`
2. Populate `conf/env` with keys and configuration options
3. `make install`
4. `make start`

### Makefile

A Makefile exists that should let you accomplish just about anything you need to do.

You can start the application by running:

`make start`

Additionally, the following make commands are available:

* `install` - Install NPM dependencies, configure environment and make map
* `start` - Starts the application only
* `getusers` - Runs the get user ID script (see scripts)
* `map` - Creates email to ID map file 
* `env` - Exports conf/env file (for envvars)
* `clean` - Remove node_modules

## Deploying

Identical to the above instructions.

## Environment

A number of environment variables are required for this application:

### Zendesk

* `ASSIGN_BOT_ZENDESK_USERNAME` - Username for your Zendesk account, ensure the account has proper permissions (to reassign tickets and get tickets)
* `ASSIGN_BOT_ZENDESK_TOKEN` - Zendesk API token, request one in the user settings on Zendesk
* `ASSIGN_BOT_ZENDESK_URI` - The URI of your Zendesk instance, expects something like `https://yourpage.zendesk.com/api/v2`

### PagerDuty
* `ASSIGN_BOT_PAGERDUTY_TOKEN` - PagerDuty API token
* `ASSIGN_BOT_PAGERDUTY_SCHEDULE_ID` - The ID of the schedule to monitor for on call determination

## Configuration Options

In addition to the environment variables there are several configuration options present in [config.js](https://github.com/silverp1/assign-bot/blob/master/config.js)

* `POLL_INTERVAL` - How often should the loop run (this includes checking on call, getting tickets, and assigning tickets to on call). Recommended default is `300s` (5 minutes). Be warned, Zendesk does rate limit so take that into consideration when changing this value.
* `STARTING_TICKET_ID` - All tickets *after* this ticket ID will be reassigned the first time the application runs. Consider making this the ID of a fairly recent ticket to avoid reassigning your old tickets in mass. Zendesk uses an autoincremented integer for the ticket ID, so if you only want _new_ tickets to be reassigned, make this value (CURRENT_MAX_TICKET_ID + 1). 
