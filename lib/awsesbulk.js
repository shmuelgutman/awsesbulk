const elasticsearch = require('@elastic/elasticsearch');
const split = require('split2');
const csvParse = require("csv-parse");
const stream = require('stream');
const Throttle = require('throttle');

/**
 *
 * @param esClient {elasticsearch.Client}
 */
module.exports = (esClient) => ({
  /**
   *
   * @param sourceStream {stream.ReadableStream}
   * @param args
   */
  run(sourceStream, args) {
    console.log("Running with args", args);
    let datasource;
    sourceStream = sourceStream.pipe(new Throttle(args.throttleMps * 1000000));
    if (args.csv) {
      datasource = sourceStream.pipe(csvParse({columns: true, relax_column_count: args.relaxColumnCount})).pipe(new stream.Transform({
        encoding: 'utf-8',
        writableObjectMode: true,
        transform(item, encoding, callback) {
          callback(null, JSON.stringify(item) + "\n");
        }
      })).pipe(split());
    } else {
      datasource = sourceStream.pipe(split());
    }

    return esClient.helpers.bulk({
      datasource,
      onDocument(doc) {
        return {index: {_index: args.index}};
      },
      flushBytes: args.flushMb * 1000000,
      flushInterval: args.flushInterval,
      concurrency: args.concurrency,
      refreshOnCompletion: args.refreshOnCompletion ? {refreshOnCompletion: args.index} : false,
    });
  }
});