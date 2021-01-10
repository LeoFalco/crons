
const { github } = require('../shared/github')

module.exports = {
  async handler (event) {
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
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event
        },
        null,
        2
      )
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
  }
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
