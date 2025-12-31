const { UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../../services/dynamo");
const response = require("../../utils/response");

exports.handler = async (event) => {
  try {
    const ticketId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    if (!ticketId) {
      return response(404, "Ticket id is required");
    }
    if (body.title == "" || body.description == "" || body.active == "") {
      return response(404, "title, description & active fields mandatory");
    }
    const result = await ddb.send(
      new GetCommand({
        TableName: "Tickets",
        Key: {
          ticketId: ticketId,
        },
      })
    );

    if (!result.Item) {
      return response(400, "Given Id not found");
    } else {
      const update = await ddb.send(
        new UpdateCommand({
          TableName: "Tickets",
          Key: {
            ticketId: ticketId,
          },
          UpdateExpression: "set title=:t, description=:d, active=:a",
          ExpressionAttributeValues: {
            ":t": body.title,
            ":d": body.description,
            ":a": body.active || "active",
          },
          ReturnValues: "ALL_NEW",
        })
      );
      if (update) {
        return response(200, "Updated Sucessfully");
      }
    }
  } catch (e) {
    return response(500, e.message);
  }
};
