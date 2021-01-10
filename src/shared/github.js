const { graphql } = require('@octokit/graphql')
const config = require('../shared/config')

const github = graphql.defaults({
  headers: {
    authorization: `token ${config.githubToken}`
  }
})

module.exports = {
  github
}
