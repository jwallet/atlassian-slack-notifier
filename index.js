const express = require("express");
const bodyParser = require("body-parser");
const handlers = require("./handlers.js");

const logger = require("./log.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/ping", (req, res) => {
  logger.info("Ping request");
  res.send("pong");
});

app.get("/envs", (req, res) => {
  const envs = [
    ["PORT", !!process.env.PORT].join(": "),
    ["READ_CHANNEL", !!process.env.READ_CHANNEL].join(": "),
    ["SLACK_AUTH_TOKEN_", !!process.env.SLACK_AUTH_TOKEN].join(": "),
  ].join("</p><p>");
  res.send(`<p>${envs}</p>`);
});

app.post("/", (req, res) => {
  if (req.body.type === "url_verification") {
    res.status(200).send(req.body.challenge);
    return;
  }

  const event = "event" in req.body ? req.body.event : req.body;
  const isMessage = event.type === "message";
  const isChannelToMonitor = event.channel === process.env.READ_CHANNEL;
  const isMessageChanged = event.subtype === "message_changed";

  if (!(isMessage && isChannelToMonitor && !isMessageChanged)) {
    res.status(400).send("This kind of message is not handled by the bot.");
    return;
  }

  logger.info("Processing message", { event: event });

  let botName = event.username;
  let eventType = event.subtype;

  if (event.bot_id) {
    botName = event.bot_profile.name;
    eventType = "bot_message";
  }

  if (eventType === "bot_message") {
    switch (botName) {
      case "Bitbucket Cloud":
        handlers.handleBitbucketMessage(event);
        break;
      case "Jira Cloud":
        handlers.handleJiraMessage(event);
        break;
      case "Confluence Cloud":
        handlers.handleConfluenceMessage(event);
        break;
      case "InVision App":
        handlers.handleInvisionMessage(event);
        break;
      default:
        logger.warn(`Unkown bot: ${event.username} (${event.bot_id})`);
        break;
    }
  } else {
    logger.info(`Received a regular message by ${event.user}. Ignoring.`, {
      text: event.text,
      author: event.user,
    });
  }
  res.status(200).json();
  return;
});

const port = 3000;
app.listen(process.env.PORT || port, function () {
  const message = "Bot is listening on port " + (process.env.PORT || port);
  console.log(message);
  logger.info(message);
});
