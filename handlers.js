const notifier = require('./slack-notifier.js');

const handleMessage = (event, userMatchRegex) => {
  var msg = event.attachments ? event.attachments[0] : event;
  const matches = msg.text.match(userMatchRegex);

  if (matches && matches.length >= 1) {

    const targets = matches.filter((v, i, a) => a.indexOf(v) === i);

    for(var i=0; i<targets.length; i++) {
      notifier.notify(event, targets[i].replace('<','').replace('>',''), msg.text);
    }
  }

}

const getReviewers = (message) => {
  if (!(message.fields && message.fields.length >= 1)) return '';

  for (var i=0; i<message.fields.length; i++) {
    var field = message.fields[i];
    if (field.title === 'Reviewers') {
      return field.value;
    }
  }
  return '';
};

const handleBitbucketMessage = (event) => {
  const userMatchRegex = /(@[U][A-Z0-9]+)/g;
  var msg = event.attachments ? event.attachments[0] : event;

  var reviewers = getReviewers(msg);
  //var textToSearchIn = msg.text + reviewers;
  var textToSearchIn = msg.text;
  const matches = textToSearchIn.match(userMatchRegex);

  if (matches && matches.length >= 1) {

    const targets = matches.filter((v, i, a) => a.indexOf(v) === i);

    for(var i=0; i<targets.length; i++) {
      notifier.notify(event, targets[i].replace('<','').replace('>',''), msg.text);
    }
  }
};

const handleJiraMessage = (event) => {
  handleMessage(event, /(@[a-z][a-z.]*[a-z.])/g);
};

const handleInvisionMessage = (event) => {
  const attachment = event.attachments[0];
  console.log(event.text);
  const matches = attachment.text.match(/(@[A-Za-z]+)/g);

  if (matches && matches.length >= 1) {

    const targets = matches
      .map(m => m.split(/(?=[A-Z])/).join('.').replace('@.', '@').toLowerCase())
      .filter((v, i, a) => a.indexOf(v) === i);

    for(var i=0; i<targets.length; i++) {
      notifier.notify(event, targets[i], attachment.text);
    }
  }

};

module.exports = {
  handleBitbucketMessage,
  handleJiraMessage,
  handleConfluenceMessage: handleBitbucketMessage,
  handleInvisionMessage
}