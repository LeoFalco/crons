
const { github } = require('../shared/github')
const { wrapHandler } = require('../shared/sentry')
const config = require('../shared/config')

async function handler (event) {
  const data = await github(`#graphql
      {
        thay: user(login: "ThayDias") {
          pullRequests(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              createdAt
              title
              isDraft
              permalink
              state
              reviewDecision
              checksUrl
              mergeable
              author {
                login
              }
            }
          }
        }
        leo: user(login: "LeoFalco") {
          pullRequests(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              createdAt
              title
              isDraft
              permalink
              state
              reviewDecision
              checksUrl
              mergeable
              author {
                login
              }
            }
          }
        }
      }
    `)

  const pullRequests = [...data.thay.pullRequests.nodes, ...data.leo.pullRequests.nodes]

  const filtered = pullRequests
    .filter(pullRequest => pullRequest.isDraft === false)
    .filter(pullRequest => pullRequest.reviewDecision !== 'APPROVED')

  console.log(formatMessage(filtered))

  return {
    statusCode: 200,
    body: JSON.stringify(mapPayload(filtered), null, 2)
  }
}

function mapPayload (pullRequests) {
  return pullRequests.map(pullRequest => {
    return {
      AUTHOR: pullRequest.author.login,
      STATUS: pullRequest.reviewDecision,
      TITLE: pullRequest.title,
      LINK: pullRequest.permalink,
      CREATED_AT: pullRequest.createdAt
    }
  })
}

function formatMessage (pullRequests) {
  return pullRequests.map(pullRequest => {
    return [
      `AUTHOR ${pullRequest.author.login}`,
      `STATUS ${pullRequest.reviewDecision || 'REVIEW_REQUIRED'}`,
      `TITLE ${pullRequest.title}`,
      `LINK ${pullRequest.permalink}`,
      `CREATED_AT ${pullRequest.createdAt}`,
      ''
    ].join('\n')
  }).join('\n')
}

module.exports.handler = config.isProduction ? wrapHandler(handler) : handler
