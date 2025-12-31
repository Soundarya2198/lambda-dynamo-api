const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const response = require("../../utils/response");
const ddb = require("../../services/dynamo");

exports.handler = async (event) => {
  try {
    const ticketId = event.pathParameters.id;
    if (!ticketId) {
      return response(404, "Ticket Id not found");
    }
    const result = await ddb.send(
      new GetCommand({
        TableName: "Tickets",
        Key: { ticketId: ticketId },
      })
    );
    console.log(result.Item);
    if (result.Item) {
      return response(200, result.Item);
    } else {
      return response(400, "Data not found");
    }
  } catch (e) {
    return response(500, e.message);
  }
};
