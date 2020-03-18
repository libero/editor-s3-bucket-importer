import { EventEmitter } from 'events';
import { default as AWS } from 'aws-sdk';

export class AwsSqsQueueMonitor extends EventEmitter {
  private queue: string;
  private buckets: string[];
  private monitoring: boolean;
  private sqs: AWS.SQS;

  constructor(queueUrl: string, buckets: string[] = ['*']) {
    super();

    this.queue = queueUrl;
    this.buckets = buckets;
    this.monitoring = false;

    this.sqs = new AWS.SQS();
  }

  async poll() {
    const params = {
      QueueUrl: this.queue,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20
    };
    const { Messages } = await this.sqs.receiveMessage(params).promise();
    if (Messages && Messages.length) {
      for (const message of Messages) {
        const messageBody = JSON.parse(message.Body);

        // We are only interested in events with 'Records', hence just delete other event types.
        if (messageBody.Records === undefined) {
          // FIXME: Should be a little more clever about when I remove a message from the queue.
          await this.deleteMessageFromQueue(message.ReceiptHandle);
          continue;
        }

        for (const record of messageBody.Records) {
          const bucketId = record.s3.bucket.name;
          const objectId = record.s3.object.key;
          if (this.buckets.includes('*') || this.buckets.includes(bucketId)) {
            switch (record.eventName) {
              case 'ObjectCreated:Put':
                const wasCreated = await this.onCreate(objectId);
                if (wasCreated) {
                  console.error(`failed to handle create for ${objectId}`);
                } else {
                  await this.deleteMessageFromQueue(message.ReceiptHandle);
                }
                break;
              case 'ObjectRemoved:Delete':
                const wasDeleted = await this.onDelete(objectId);
                if (wasDeleted) {
                  console.error(`failed to handle create for ${objectId}`);
                } else {
                  await this.deleteMessageFromQueue(message.ReceiptHandle);
                }
                break;
              default:
                console.info(`Unsupported event type ${record.eventName}.`);
                // FIXME: Should be a little more clever about when I remove a message from the queue.
                await this.deleteMessageFromQueue(message.ReceiptHandle);
                break;
            }
          }
        }
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

  async onCreate(objectId: string): Promise<number> {
    this.emit('created', {
      objectId
    });
    return 0;
  }

  async onDelete(objectId: string): Promise<number> {
    this.emit('deleted', {
      objectId
    });
    return 0;
  }

  async deleteMessageFromQueue(messageId: string): Promise<number> {
    const deleteParams: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: this.queue,
      ReceiptHandle: messageId
    };

    // FIXME: Ensure that this call succeeds, and handle errors gracefully.
    await this.sqs.deleteMessage(deleteParams).promise();
    return 0;
  }
}
