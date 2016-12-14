/**
 * Created by yoni on 12/7/16.
 */
var winston = require('winston'),
    slackWinston = require('slack-winston').Slack;


module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.Slack)({
            domain: process.env.LOG_SLACK_DOMAIN ||'domain',
            token: process.env.LOG_SLACK_TOKEN || 'some-key',
            channel: process.env.LOG_SLACK_CHANNEL || 'xml2json',
            username : process.env.LOG_SLACK_USER || 'username',
            level: process.env.LOG_LEVEL || 'info'
        })
    ]
});