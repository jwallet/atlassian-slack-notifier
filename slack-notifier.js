const logger = require("./log.js");
const request = require("request");

const getPermalink = (event, cb) => {
  const query =
    "?token=" +
    process.env.SLACK_AUTH_TOKEN +
    "&channel=" +
    event.channel +
    "&message_ts=" +
    event.ts;

  request.get("https://slack.com/api/chat.getPermalink" + query, function (
    error,
    response,
    body
  ) {
    cb(JSON.parse(body).permalink);
  });
};

const notify = (event, mention, text) => {
  if (typeof text !== "string") return;

  logger.info("Notifiying: " + mention);

  getPermalink(event, (link) => {
    var data = {
      form: {
        token: process.env.SLACK_AUTH_TOKEN,
        channel: mention,
        text: [
          `<${mention}>`,
          "Tu as été mentionné dans le channel `#_notifications`",
        ].join(" "),
        attachments: JSON.stringify([
          {
            fallback: "Message originale: " + link,
            text: text,
            footer: link,
          },
        ]),
      },
    };

    request.post("https://slack.com/api/chat.postMessage", data, function (
      error,
      response,
      body
    ) {
      const result = JSON.parse(body);
      if (!result.ok)
        logger.error("Slack returned an error", { details: result });
    });
  });
};

module.exports = {
  notify,
};
