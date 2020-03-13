import { default as AWS } from 'aws-sdk';
import { default as config } from './config.js';

AWS.config.update(config);

let terminate = false;
const url = `https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`;
const sqs = new AWS.SQS();

const params = {
  QueueUrl: url,
  MaxNumberOfMessages: 1,
  WaitTimeSeconds: 20
};

async function poll(queue) {
  const { Messages } = await sqs.receiveMessage(params).promise();
  if (Messages && Messages.length) {
    console.log(`Got: ${Messages.length} event(s) to process`);

    for (const message of Messages) {
      console.log(`Processing: ${message.MessageId}`);
      console.log(`Event: ${message.Body}`);

      const deleteParams = {
        QueueUrl: url,
        ReceiptHandle: message.ReceiptHandle
      };

      await sqs.deleteMessage(deleteParams).promise();
    }
  }
}

let count = 0;
async function listen() {
  do {
    console.log(`${++count}: Polling...`);
    await poll();
  } while (!terminate);
}

process.on('SIGINT', () => {
  terminate = true;
});

process.on('SIGTERM', () => {
  terminate = true;
});

listen();
