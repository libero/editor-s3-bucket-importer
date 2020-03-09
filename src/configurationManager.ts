import { Configuration } from './configuration';

export class ConfigurationManager {
  private config: Map<string, string>;

  constructor(defaults: Configuration, seed?: Configuration) {
    this.config = new Map();

    // Initialise the manager with the defaults
    for (let [key, value] of Object.entries(defaults)) {
      this.config.set(key, value);
    }

    if (seed) {
      for (let [key, value] of Object.entries(seed)) {
        if (this.config.has(key)) {
          this.config.set(key, value);
        }
      }
    }
  }

  addConfigItem(key: string, value: string): void {
    if (this.config.has(key)) {
      throw new Error(`${key}' already exists!`);
    }
    this.config.set(key, value);
  }

  getConfigItem(key: string): string {
    if (!this.config.has(key)) {
      throw new Error(`No such item '${key}'!`);
    }
    return this.config.get(key);
  }
}
