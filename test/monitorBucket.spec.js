import { default as AWS } from 'aws-sdk';
import { default as config } from './config.js';

AWS.config.update(config);

const url = `https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`;
const sqs = new AWS.SQS();

const params = {
  QueueUrl: url,
  MaxNumberOfMessages: 1,
  WaitTimeSeconds: 20
};

sqs.receiveMessage(params, (err, data) => {
  if (err) {
    console.log(`Error: ${err.stack}`);
  } else {
    if (data && data.Messages) {
      console.log(`Got: ${data.Messages.length} event(s) to process`);

      for (const message of data.Messages) {
        console.log(`Processing: ${message.MessageId}`);
        console.log(`Event: ${message.Body}`);

        const deleteParams = {
          QueueUrl: url,
          ReceiptHandle: message.ReceiptHandle
        };

        sqs.deleteMessage(deleteParams, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log('Successfully deleted message from queue');
          }
        });
      }
    }
  }
});
