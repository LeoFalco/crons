const { handler } = require('../src/handlers/cron')

describe('Name of the group', () => {
  it('should run', async () => {
    const result = await handler()
    console.log('result', result)
  })
})
