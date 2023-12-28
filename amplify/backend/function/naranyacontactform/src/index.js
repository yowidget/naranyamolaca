const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2"); // CommonJS import

const client = new SESv2Client({ region: "us-east-2" });

exports.handler = async (event) => {
  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'INSERT') {
      //pull off items from stream
      const candidateName = streamedItem.dynamodb.NewImage.name.S
      const candidateEmail = streamedItem.dynamodb.NewImage.email.S

    
      
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
              Data: "Contacto Registrado", // required
              // Charset: "STRING_VALUE",
            },
            Body: { // Body
              Text: {
                Data: `El contacto ${candidateEmail} ha sido registrado `, // required
                // Charset: "STRING_VALUE",
              },
              Html: {
                Data: `El contacto <h1> ${candidateEmail} </h1> ha sido registrado `, // required
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

    }
  }
  return { status: 'done' }
}
