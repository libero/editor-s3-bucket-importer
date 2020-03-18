import { ConfigurationManager } from './configurationManager.js';
import { AwsSqsQueueMonitor } from './awsSqsQueueMonitor.js';

const args: string[] = process.argv.slice(2);
const configurationManager: ConfigurationManager = new ConfigurationManager(args);

const monitor = new AwsSqsQueueMonitor(
  `https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`
);

monitor.on('created', (event) => {
  console.log(`Object ${event.objectId} has been created`);
});

monitor.on('deleted', (event) => {
  console.log(`Object ${event.objectId} has been deleted`);
});

monitor.start();
