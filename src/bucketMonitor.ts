import { default as AWS } from 'aws-sdk';

export interface BucketMonitorConfig {
  id: string;
  key: string;
}

export class BucketMonitor {
  private bucketName: string;
  private queueUrl: string;
  private monitoring: boolean;
  private sqs: AWS.SQS;

  constructor(queueUrl: string, bucketName: string = '*') {
    this.queueUrl = queueUrl;
    this.bucketName = bucketName;
    this.monitoring = false;

    this.sqs = new AWS.SQS();
  }

  async poll() {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20
    };
    const { Messages } = await this.sqs.receiveMessage(params).promise();
    if (Messages && Messages.length) {
      console.log(`Got: ${Messages.length} event(s) to process`);

      for (const message of Messages) {
        console.log(`Processing: ${message.MessageId}`);
        console.log(`Event: ${message.Body}`);

        const deleteParams = {
          QueueUrl: this.queueUrl,
          ReceiptHandle: message.ReceiptHandle
        };

        await this.sqs.deleteMessage(deleteParams).promise();
      }
    }
  }

  async startMonitor() {
    this.monitoring = true;
    do {
      await this.poll();
    } while (this.monitoring);
  }

  stopMonitor(): void {
    this.monitoring = true;
  }

  onCreate(): void {
    console.log('Object has been created');
  }

  onDelete(): void {
    console.log('Object has been deleted');
  }

  onUpdated(): void {
    console.log('Object has been updated');
  }
}
