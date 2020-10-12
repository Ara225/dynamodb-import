# dynamodb-import
A simple module to import JSON files into DynamoDB. Works at the CLI or as an imported module.

## CLI Usage
Call dynamodb-import at the command or the module directly with npx dynamodb-import
### Required Args
* --jsonFile - Path to the JSON file to load data from. Should contain a list of objects. Can be any size
* --tableName - Name of the DynamoDB table to import into
* --regionName - Name of the AWS region to use
### Optional
* --maxBatchSize - The max on the DynamoDB side is 25, and this defaults to that. If you have very large objects, you might run into the separate size limit and need to reduce that
* --endpoint - The DynamoDB endpoint to connect to. Useful if you're connecting to a local DynamoDB.

## Module Usage
### Required Args
* data - JSON data
* tableName - Name of the DynamoDB table to import into
* regionName - Name of the AWS region to use
### Optional
* maxBatchSize - The max on the DynamoDB side is 25, and this defaults to that. If you have very large objects, you might run into the separate size limit and need to reduce that
* endpoint - The DynamoDB endpoint to connect to. Useful if you're connecting to a local DynamoDB.

```js
const dynamoDBImporter = require("dynamodb-import");
let data = [{ test1: "Hello", test2: "World" , id: 1 }, { test1: "Hello2", test2: "World2" , id: 2 }]
dynamoDBImporter.importToDynamoDB(data, "testTable", "eu-west-2", 25, "http://localhost:8000")
```
