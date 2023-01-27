const winston = require("winston");
const DatadogTransport = require("@shelf/winston-datadog-logs-transport");

const logger = winston.createLogger({
  transports: [
    new DatadogTransport({
      apiKey: process.env.DATADOG_API_KEY,
      metadata: {
        source: "heroku.com",
        host: "atlassian-slack-notifier.herokuapp.com",
        service: "slack-notifier",
        environment: "prod",
      },
    }),
  ],
});

logger.info("Datadog logger initialized.");

module.exports = logger;
