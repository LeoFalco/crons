const { graphql } = require('@octokit/graphql')

const github = graphql.defaults({
  headers: {
    authorization: 'Bearer 8c89c7801fbd86f0d7a78f3d53b02f706774b403'
  }
})

module.exports = {
  github
}
