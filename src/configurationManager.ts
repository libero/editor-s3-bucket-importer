export interface IConfigurationManager {
  addConfigItem(key: string, value: string): void;
  getConfigItem(key: string): string;
}

export class ConfigurationManager implements IConfigurationManager {
  private config: Map<string, string>;

  constructor(args: string[]) {
    this.config = new Map();
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
