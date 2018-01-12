# AssignBot

## Purpose

AssignBot will poll a PagerDuty schedule periodically to determine who is on call in your organization. AssignBot will then assign the on call individual all Zendesk tickets until he or she is no longer on call.

## Dependencies

The only notable dependency is Node.js version 6.

If you are curious about the actual node modules, take a look at package.json.

### Security Considerations

This is likely going to be run on premise. To make that process as painless as possible, the application gets all the data it needs. No internal connections are required so no VPN or special network considerations are required.

## Development

First, copy the example env file from conf/env.example to conf/env. Edit conf/env with the tokens and other values specified.

A Makefile exists that should let you accomplish just about anything you need to do.

You can start the application by running:

`make`

Additionally, the following make commands are available:

`install` - Install NPM dependencies
`start` - Starts the application only
`getusers` - Runs the get user ID script (see scripts)
`env` - Exports conf/env file (for envvars)

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

In addition to the environment variables you can also tweak the polling time for on calls / ticket reassignment in `config.js`

## Scripts

Helper scripts exist to obtain user ID's necessary to add the mapper configuration for PagerDuty users to Zendek users.

Run this script using `make getusers` for a list of all agents and their ID's in Zendesk. 
