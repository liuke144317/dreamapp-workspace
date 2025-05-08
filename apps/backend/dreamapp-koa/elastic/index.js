const elasticsearch = require('elasticsearch');
const config = require('../config.js')
const esClient = new elasticsearch.Client({
    // host: '127.0.0.1:9200',
    host: config.elasticSearch.HOST + ':' + config.elasticSearch.port,
    log: 'error'
});
module.exports = esClient