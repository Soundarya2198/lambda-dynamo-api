const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const response = require("../../utils/response");

const s3 = new S3Client({ region: "ap-south-1" });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const ticketId = body.ticketId;

    if (!ticketId || !body.fileName || !body.contentType) {
      return response(400, "ticketId, fileName & contentType required");
    }

    const key = `tickets/${ticketId}/${body.fileName}`;

    const command = new PutObjectCommand({
      Bucket: "ticket-files-soundarya",
      Key: key,
      ContentType: body.contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // 5 minutes
    });

    return response(200, {
      uploadUrl,
      fileUrl: `https://ticket-files-soundarya.s3.ap-south-1.amazonaws.com/${key}`,
    });
  } catch (e) {
    return response(500, e.message);
  }
};
