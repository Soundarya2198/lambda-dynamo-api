const { DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = require("../../services/dynamo");
const response = require("../../utils/response");

exports.handler = async (event) => {
  try {
    const ticketId = event.pathParameters.id;
    if (!ticketId) {
      return response(404, "Ticket id is required");
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
      const del = await ddb.send(
        new DeleteCommand({
          TableName: "Tickets",
          Key: {
            ticketId: ticketId,
          },
        })
      );

      if (del) {
        return response(200, "Deleted Sucessfully");
      }
    }
  } catch (e) {
    return response(500, e.message);
  }
};
