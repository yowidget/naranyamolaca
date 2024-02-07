/* Amplify Params - DO NOT EDIT
  API_NARANYAWEB_GRAPHQLAPIIDOUTPUT
  API_NARANYAWEB_LEADTABLE_ARN
  API_NARANYAWEB_LEADTABLE_NAME
  ENV
  REGION
Amplify Params - DO NOT EDIT */
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2"); // CommonJS import

const client = new SESv2Client({ region: process.env.REGION });


const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

exports.handler = async (event) => {
  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'INSERT') {
      //pull off items from stream
      console.log({ item: streamedItem.dynamodb.NewImage })
      const id = streamedItem.dynamodb.NewImage.id.S
      const recaptchaToken = streamedItem.dynamodb.NewImage.recaptchaToken.S
      const candidateName = streamedItem.dynamodb.NewImage.name.S
      const candidateEmail = streamedItem.dynamodb.NewImage.email.S
      const candidateInteres = streamedItem.dynamodb.NewImage.interes.S
      const candidateMensaje = streamedItem.dynamodb.NewImage.mensaje.S

      const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GRECAPTCHA_SECRETKEY}&response=${recaptchaToken}`)
      if (res.ok) {
        const data = await res.json();
        console.log({ data });
        if (data.score) {
          const dbObj = {
            TableName: process.env.API_NARANYAWEB_LEADTABLE_NAME,
            Key: {
              id,
            },
            UpdateExpression: "set recaptchaScore = :score",
            ExpressionAttributeValues: {
              ":score": data.score,
            },
            ReturnValues: "ALL_NEW",
          }
          console.log({ dbObj })

          const dbCommand = new UpdateCommand(dbObj);

          const dbResponse = await docClient.send(dbCommand);
          console.log(dbResponse);

          if (Number(data.score) > 0.6) {
            const input = { // SendEmailRequest
              FromEmailAddress: process.env.SES_EMAIL,
              // FromEmailAddressIdentityArn: "STRING_VALUE",
              Destination: { // Destination
                ToAddresses: [ // EmailAddressList
                  process.env.SES_EMAIL,
                ],

              },
              ReplyToAddresses: [
                process.env.SES_EMAIL,
              ],
              Content: { // EmailContent
                Simple: { // Message
                  Subject: { // Content
                    Data: "Contacto Web", // required
                    // Charset: "STRING_VALUE",
                  },
                  Body: { // Body
                    Text: {
                      Data: `Se ha registrado ${candidateName} ${candidateEmail} bajo el interés: ${candidateInteres}.
                    "${candidateMensaje}"`, // required
                      // Charset: "STRING_VALUE",
                    },
                    Html: {
                      Data: `Se ha registrado <b>${candidateName}</b> ${candidateEmail} bajo el interés: <b>${candidateInteres}</b>.
                    "${candidateMensaje}"`, // required
                      // Charset: "STRING_VALUE",
                    }
                  }
                }
              }
            };
            console.log({ input })
            const command = new SendEmailCommand(input);
            const response = await client.send(command);
            console.log({ response })
          } else {
            console.log("Bot")
          }
        }
      }
    }
  }
  return { status: 'done' }
}
