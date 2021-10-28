# awsesbulk
Bulk indexing command line tool for AWS ElasticSearch/Opensearch

This is a simple wrapper around elasticsearch [Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html).  
It reads the input data from the stdin and hence, can be easily utilized the pipe `|` pattern.

If your aws elasticsearch domain is configured with IAM access policy, this tool also properly sign the request for you.
The credentials are calculated the same way it works in AWS-SDK.

Installation  
`npm i -g awsesbulk`

The input data can be csv-formatted or using a newline delimited JSON (NDJSON).

CSV:  
```bash
cat some_very_big_file.csv | awsesbulk --endpoint $ecsendpoint --index $indexname --region us-east-1 --csv
```  
NDJSON:  
```bash
echo '{"foo": "bar"}\n{"foo1":"bar1"}\n' | awsesbulk --endpoint $ecsendpoint --index $indexname --region us-east-1
```

Use the `--help` to view additional options