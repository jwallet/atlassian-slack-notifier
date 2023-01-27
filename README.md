Slack app that notifies user when they are mentionned on an Atlassian Cloud product: BitBucket, Jira, Confluence and inVision

1. Create a public #notifications channel
   1. Mute the channel for everyone
1. Add Atlassian Cloud app to your Slack Workspace to publish mentions into a #notifications channel
   1. Atlassian bot only mention the person creating the event, which is useless. We want the tagged person to be notified in Slack.
1. Create a dummy Slack app https://api.slack.com/apps
   1. Configure it to read a #notification channel
   1. This bot will publis read messages to a webhook, you will set this url to this project webservice once up.
1. Publish this repo to "railway", "vercel", "heroku" or "render"
   1. get the url and set it to the Slack bot webhook url
   1. set the environment variables

```
GET / 
  Will read the request body to find user match to notify user in Slack
  Supports Bitbucket, Confluence, Jira and InVision
GET /envs
  Show the environment variables
  #SLACK_AUTH_TOKEN : Bot Auth Token
  #READ_CHANNEL : Slack channel id ... find it by opening Slack Web https://app.slack.com/
  #PORT : Web service port, default 3000
GET /ping
  Web service health check
```
