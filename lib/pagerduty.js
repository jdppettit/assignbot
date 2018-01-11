const pagerduty = require('node-pagerduty');
const config = require('../config.js');

const pd = new pagerduty(config.PAGERDUTY_TOKEN);

export const getOnCall = () => {
  return pd.schedules.listUsersOnCall(config.PAGERDUTY_SCHEDULE_ID, {})
    .then(res => {
      return JSON.parse(res.body);
    })
    .catch(err => {
      console.log(err);
    });
};

export const getSchedules = () => {
  return pd.schedules.listSchedule({})
    .then(res => {
      console.log(res.body);
    })
    .catch(err => {
      console.log(err)
    });
}
