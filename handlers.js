const notifier = require("./slack-notifier.js");
const _deburr = require("lodash.deburr");
const _words = require("lodash.words");

const getJiraMessageQuote = (event) => {
  const { blocks } = event;
  if (!Array.isArray(blocks) || blocks.length < 2) return undefined;
  // blocks[0]: is there header with <slack/> tag as text
  return blocks[1].text;
};

const getBitbucketMessageQuote = (event) =>
  event.attachments ? event.attachments[0] : undefined;

const getInvisionMessageQuote = (event) =>
  event.attachments ? event.attachments[0] : undefined;

const handleBitbucketMessage = (event) => {
  const userMatchRegex = /(@[U][A-Z0-9]+)/g; // <@UA1BCDEF>
  var msg = getBitbucketMessageQuote(event);

  if (!msg || !userMatchRegex.test(_deburr(msg.text).toUpperCase())) return;

  const matches = _deburr(msg.text).match(userMatchRegex);

  if (matches && matches.length >= 1) {
    const targets = matches.filter((v, i, a) => a.indexOf(v) === i);

    for (var i = 0; i < targets.length; i++) {
      const mention = targets[i].replace("<", "").replace(">", ""); // <@UA1BCDEF>
      notifier.notify(event, mention, msg.text);
    }
  }
};

const handleJiraMessage = (event) => {
  const userMatchRegex = /(@[A-Za-z]+)/g; // @MonsieurMister
  var msg = getJiraMessageQuote(event);

  if (!msg || !userMatchRegex.test(_deburr(msg.text).toLowerCase())) return;

  const matches = _deburr(msg.text).match(userMatchRegex);

  if (matches && matches.length >= 1) {
    const targets = matches.filter((v, i, a) => a.indexOf(v) === i);

    for (var i = 0; i < targets.length; i++) {
      const mention = `@${_words(targets[i])
        .map((w) => w.toLowerCase())
        .join(".")}`;
      notifier.notify(event, mention, msg.text);
    }
  }
};

const handleInvisionMessage = (event) => {
  const userMatchRegex = /(@[A-Za-z]+)/g; // @MonsieurMister
  const msg = getInvisionMessageQuote(event);

  if (!msg || !userMatchRegex.test(_deburr(msg.text).toLowerCase())) return;

  const matches = _deburr(msg.text).match(userMatchRegex);

  if (matches && matches.length >= 1) {
    const targets = matches
      .map((m) =>
        m
          .split(/(?=[A-Z])/)
          .join(".")
          .replace("@.", "@")
          .toLowerCase()
      )
      .filter((v, i, a) => a.indexOf(v) === i);

    for (var i = 0; i < targets.length; i++) {
      const mention = targets[i];
      notifier.notify(event, mention, attachment.text);
    }
  }
};

module.exports = {
  handleBitbucketMessage,
  handleJiraMessage,
  handleConfluenceMessage: handleBitbucketMessage,
  handleInvisionMessage,
};
