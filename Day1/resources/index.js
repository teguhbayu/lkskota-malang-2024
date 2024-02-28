const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDb.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let StatusCode = 200;
    const headers = {"Content-Type": "application/json"};
    try {
        console.info("event data: " + JSON.stringify(event))
        switch (event.httpMethod + " " + event.resource){
            case "DELETE /product/{id}":
                await dynamo.delete({TableName: "products", Key:{id: event.pathParameters.id}}).promise();
                body = `Deleted item ${event.pathParameters.id}`
                break
            case "GET /products":
                body = await dynamo.scan({TableName: "products"}).promise()
                break
            case "PUT /products":
                let requestJSON = JSON.parse(event.body)
                await dynamo.put({TableName: "products", Item:{id: requestJSON.JSON.id, price: requestJSON.price, name: requestJSON.name}}).promise()
                body = `Put item ${requestJSON.id}`
                break
            default:
                throw new Error(`Unsupported route: "${event.htttpMethod + " " + event.resource + " - EVENT: " + JSON.stringify(event)}"`)
        }
    } catch(err){
        StatusCode = 400
        body = err.message
    } finally{
        body = JSON.stringify(body)
    }
    return{
        StatusCode,
        body,
        headers
    }
}