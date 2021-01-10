const sentry = require('@sentry/serverless')

sentry.AWSLambda.init({
  dsn: 'https://530a6cf12fb4493d8bafc5a196407515@o444387.ingest.sentry.io/5586101',
  tracesSampleRate: 1.0
})

const wrapHandler = sentry.AWSLambda.wrapHandler

module.exports = {
  sentry,
  wrapHandler
}
