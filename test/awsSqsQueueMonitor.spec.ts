import { default as AWS } from 'aws-sdk';
import { AwsSqsQueueMonitor } from '../src/awsSqsQueueMonitor';
import { default as fs } from 'fs';

describe('AwsSqsQueueMonitor', () => {
  let monitor: AwsSqsQueueMonitor;
  let s3: AWS.S3;
  let file: fs.ReadStream;
  let callback: jest.Mock;

  beforeAll(() => {
    console.log('beforeAll() Called...');
    s3 = new AWS.S3();
    monitor = new AwsSqsQueueMonitor(`https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`);
    file = fs.createReadStream('./test/resources/hello_world.v2.txt');
    callback = jest.fn();
    monitor.on('created', callback);
  });

  afterAll(() => {
    console.log('afterAll() Called...');
    file.close();
  });

  it("A 'create' event when a new object is created in the bucket", async () => {
    console.log('test() Called...');
    const testParams: AWS.S3.PutObjectRequest = {
      Bucket: 'test-editor-s3-bucket',
      Key: 'hello_world.v2.txt',
      Body: file
    };
    await s3.upload(testParams).promise();
    await monitor.poll();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
