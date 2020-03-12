import { ConfigurationManager } from './configurationManager.js';
import { BucketMonitor } from './bucketMonitor.js';

const args: string[] = process.argv.slice(2);
const configurationManager: ConfigurationManager = new ConfigurationManager(args);

const monitor = new BucketMonitor(`https://sqs.us-east-2.amazonaws.com/540790251273/test-editor-bucket-event-queue`);
monitor.startMonitor();
