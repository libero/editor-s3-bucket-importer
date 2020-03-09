import { ConfigurationManager } from './configurationManager';

describe('ConfigurationManager::addConfigItem', () => {
  let conMan: ConfigurationManager;
  beforeAll(() => {
    conMan = new ConfigurationManager([]);
  });

  it('Not throw an exception on successs', () => {
    expect(() => {
      conMan.addConfigItem('test', 'value');
    }).not.toThrow();
  });

  it('Throw an exception if the item already exists', () => {
    expect(() => {
      conMan.addConfigItem('test', 'value');
    }).toThrow();
  });
});

describe('ConfigurationManager::getConfigItem', () => {
  let conMan: ConfigurationManager;
  beforeAll(() => {
    conMan = new ConfigurationManager([]);
    conMan.addConfigItem('test', 'value');
  });

  it('Can retrive an existing config item', () => {
    expect(conMan.getConfigItem('test')).toEqual('value');
  });

  it('Throws an exception if the config item does not exist', () => {
    expect(() => {
      conMan.getConfigItem('nope');
    }).toThrow();
  });
});
