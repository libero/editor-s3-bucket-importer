import { default as AWS } from 'aws-sdk';
import { AwsSqsQueueMonitor } from './awsSqsQueueMonitor';
import { default as fs } from 'fs';

describe('AwsSqsQueueMonitor', () => {
  let monitor: AwsSqsQueueMonitor;

  beforeAll(() => {
    monitor = new AwsSqsQueueMonitor(`https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`);
    monitor.startMonitor();
  });

  afterAll(() => {
    monitor.stopMonitor();
  });

  it('Raising an event when a new object is created in the bucket', () => {
    expect(() => {
      const testParams: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: 'hello_world.txt',
        Body: file
      };
      return s3.upload(testParams).promise();
    }).not.toThrow();
  });
});
