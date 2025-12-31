const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const response = require("../../utils/response");
const ddb = require("../../services/dynamo");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (body.title == "" || body.description == "" || body.active == "") {
      return response(404, "title, description & active fields mandatory");
    }

    const ticket = {
      ticketId: uuidv4(),
      title: body.title,
      description: body.description,
      active: body.active,
    };
    const result = await ddb.send(
      new PutCommand({
        TableName: "Tickets",
        Item: ticket,
      })
    );
    if (result) {
      return response(200, ticket);
    } else {
      return response(500, { msg: "Something went wrong" });
    }
  } catch (e) {
    return response(500, { msg: e.message });
  }
};
