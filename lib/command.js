const {Command} = require('commander');
const commander = require('commander');
const awsesbulk = require('../lib/awsesbulk');
const { createConnector } = require('aws-elasticsearch-js');
const elasticsearch = require('@elastic/elasticsearch');

function _parseInt(value, prev) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function _parseFlot(value) {
  // parseInt takes a string and a radix
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const program = new Command();

program
  .requiredOption('--endpoint <endpoint>', 'The elasticsearch service endpoint hosted in AWS')
  .requiredOption('--index <index>', 'The ES index to insert the docs into')
  .option('--flush-mb <MB>', 'The size of the bulk body in MB to reach before to send it. Default of 5MB.', _parseInt, 5)
  .option('--flush-interval <milliseconds>', 'How much time (in milliseconds) the helper waits before flushing the body from the last document read.', parseInt, 30000)
  .option('--concurrency <number>', 'How many request is executed at the same time.', _parseInt, 5)
  .option('--refresh-on-completion', 'If true, at the end of the bulk operation it runs a refresh on the index')
  .option('--csv', 'If true, treat the input stream as csv with header row')
  .option('--region <r>', 'AWS region')
  .option('--throttle-mps <MB>', 'Throttleling value to pass through the stream in MB per Second (decimal number allowed)', _parseFlot, 1)
  .option('--relax-column-count', 'Discard inconsistent columns count; disabled if null, false or empty; default to false.')
  .action((args) => {
    const region = args.region || process.env.AWS_REGION;

    const client = new elasticsearch.Client({
      nodes: [args.endpoint],
      Connection: createConnector({region})
    });
    return awsesbulk(client).run(process.stdin, args)
      .then(res => {
        console.log(res);
      });
  });

module.exports = program;
