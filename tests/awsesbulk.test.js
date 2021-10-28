const program = require('../lib/command');
const awsesbulk = require('../lib/awsesbulk');
const {PassThrough} = require('stream');

test('awsesbulk basic test', async () => {

  const bulkMock = jest.fn().mockResolvedValue("OK");
  const sourceStream = new PassThrough();

  await awsesbulk({
    helpers: {
      bulk: bulkMock
    }
  }).run(sourceStream, {
    flushMb: 2
  });

  sourceStream.write('Hello world');
  sourceStream.end();

  //console.log(bulkMock.mock.calls[0]);
  expect(bulkMock.mock.calls.length).toBe(1);
  expect(bulkMock.mock.calls[0][0].flushBytes).toBe(2 * 1000000)
});