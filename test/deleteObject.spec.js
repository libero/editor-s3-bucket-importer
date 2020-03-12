import { default as AWS } from 'aws-sdk';
import { default as config } from './config.js';

AWS.config.update(config);

const s3 = new AWS.S3();

const params = {
  Bucket: 'test-editor-s3-bucket',
  Key: 'hello_world.txt'
};

s3.deleteObject(params, (err, data) => {
  if (err) {
    console.log(`Error: ${err.stack}`);
  } else {
    console.log(`Got: ${data}`);
  }
});
