const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");

const notifier = require("./slack-notifier.js");
const handlers = require("./handlers.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const event = req.body.event;
  if (event.type !== 'message' || event.channel !== process.env.NOTIFICATION_CHANNEL) return;
  if (event.subtype == 'message_changed') return;

  if (event.subtype === 'bot_message') {
    switch (event.bot_id) {
      case process.env.BOT_ID_BITBUCKET:
        handlers.handleBitbucketMessage(event);
        break;
      case process.env.BOT_ID_JIRA:
        handlers.handleJiraMessage(event);
        break;
      case process.env.BOT_ID_CONFLUENCE:
        handlers.handleConfluenceMessage(event);
        break;
      case process.env.BOT_ID_INVISION:
        handlers.handleInvisionMessage(event);
        break;
      default:
        console.log("Unknown bot", event);
        break;
    }
  } else {
    console.log(event);
    console.log("Recieved a regular message:", event.text, "by", event.user, ". Ignoring.");
  }
  res.json();
  return;
});

const PORT = 3000;
app.listen(process.env.PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});
