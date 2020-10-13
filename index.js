#!/usr/bin/env node
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const attr = require('dynamodb-data-types').AttributeValue;
const {argv} = require('yargs')

async function importToDynamoDB(data, tableName, regionName, maxBatchSize, endpoint) {
    if (!data || !tableName || !regionName) {
        throw Error("Missing required arguments to importToDynamoDB function. See readme");
    }
    if (!maxBatchSize) {
        maxBatchSize = 25;
    }
    // Set the region
    AWS.config.update({ region: regionName });
    console.log("DynamoDB import started");
    // Create DynamoDB service object
    if (endpoint) {
        var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: endpoint });
    }
    else {
        var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10'});
    }
    let items = [];
    for (let index = 0; index < data.length; index++) {
        console.log("Processing item " + index.toString());
        const element = data[index];
        // Format element in the correct format for DynamoDB's API 
        let item = {
            PutRequest: {
                Item: attr.wrap(element)
            }
        };
        items.push(item);
    
        if (items.length == maxBatchSize || index == data.length-1) {
            let params = {
                RequestItems: {
                }
            };
            params["RequestItems"][tableName] = items;
            console.log(params)
            // Async function call to write the items to the DB 
            await new Promise((resolve, reject) => {
                ddb.batchWriteItem(params, function (err, data) {
                    if (err) {
                        console.log("Error happened while attempting to batch write items.");
                        reject(err);
    
                    } else {
                        console.log("Success", data);
                        resolve(data)
                    }
                });
            });
            items = [];
        }
    }
}

if (require.main === module) {
    if (argv._.length) {
        throw Error("The arguments " + argv._ +" exist without being attached to an  option (or flag). Required Args: --jsonFile --tableName --regionName");
    }
    else if (argv.jsonFile && argv.tableName && argv.regionName) {
        let data = require(argv.jsonFile);
        importToDynamoDB(data, argv.tableName, argv.regionName, argv.maxBatchSize, argv.endpoint);
    }
    else {
        throw Error("Missing required arguments. Required Args: --jsonFile --tableName --regionName");
    }
}

module.exports.importToDynamoDB = importToDynamoDB;