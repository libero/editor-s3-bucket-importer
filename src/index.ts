import { defaultConfiguraton } from './defaultConfiguration.js';
import { ConfigurationManager } from './configurationManager.js';

//const args: string[] = process.argv.slice(2);
const configurationManager: ConfigurationManager = new ConfigurationManager(defaultConfiguraton);

console.log(configurationManager.getConfigItem('messageQueueAddress'));
