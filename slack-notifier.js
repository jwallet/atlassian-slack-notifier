const request = require("request");

const getPermalink = (event, cb) => {
  const query =
    "?token=" + process.env.SLACK_AUTH_TOKEN +
    "&channel=" + event.channel +
    "&message_ts=" + event.ts;

  request.get('https://slack.com/api/chat.getPermalink' + query, function (error, response, body) {
    cb(JSON.parse(body).permalink);
  });

}

const notify = (event, user, customText) => {

  console.log("Notifiying", user);

  getPermalink(event, (link) => {
    var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: user,
      text: "You were mentionned in the notification channel",
      attachments: JSON.stringify([
        {
          "fallback": "Original message: " + link,
          "text": customText || event.text,
          "footer": link
        }
      ])
    }};

    request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
      const result = JSON.parse(body);
      if (!(body.ok)) console.log(body);
    });
  });
};

module.exports = {
  notify
};