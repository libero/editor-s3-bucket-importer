import { default as AWS } from 'aws-sdk';
import { AwsSqsQueueMonitor } from '../src/awsSqsQueueMonitor';
import { default as fs } from 'fs';

describe('AwsSqsQueueMonitor::Poll', () => {
  const queue = 'https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue';
  let monitor: AwsSqsQueueMonitor;
  let s3: AWS.S3;

  beforeAll(() => {
    s3 = new AWS.S3();
    monitor = new AwsSqsQueueMonitor(queue);
  });

  test("Raises a 'created' event when a new object is created", async () => {
    let file: fs.ReadStream = fs.createReadStream('./test/resources/hello_world.v2.txt');
    let callback: jest.Mock = jest.fn();
    monitor.on('created', callback);
    const testParams: AWS.S3.PutObjectRequest = {
      Bucket: 'test-editor-s3-bucket',
      Key: 'hello_world.v2.txt',
      Body: file
    };
    await s3.upload(testParams).promise();
    await monitor.poll();
    expect(callback).toHaveBeenCalledTimes(1);
    file.close();
  });

  test("Raises a 'deleted' event when an object is deleted", async () => {
    let callback: jest.Mock = jest.fn();
    monitor.on('deleted', callback);
    const testParams: AWS.S3.DeleteObjectRequest = {
      Bucket: 'test-editor-s3-bucket',
      Key: 'hello_world.v2.txt'
    };
    await s3.deleteObject(testParams).promise();
    await monitor.poll();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
