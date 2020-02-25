import { ConfigurationManager } from './configurationManager';

const args: string[] = process.argv.slice(2);
const configurationManager: ConfigurationManager = new ConfigurationManager(args);
