const { validOutput, processConfig, processOptions } = require('./options');
jest.mock('fs');
const fs = require('fs');

describe('validOutput tests', () => {
  const MOCK_FILE_OUTPUT_DIRECTORIES = {
    '/path/to/output1/': '',
    '/path/to/output2/': '',
  };

  beforeAll(() => {
    // Set up some mocked out file info before each test
    fs.__setMockOutputDirectories(MOCK_FILE_OUTPUT_DIRECTORIES);
  });

  test('empty, null, undefined should return false', () => {
    [null, undefined, ''].forEach((path) => expect(validOutput(path)).toBe(false));
  });

  test('a directory that exists should return true', () => {
    ['/path/to/output1/', '/path/to/output2/'].forEach((path) =>
      expect(validOutput(path)).toBe(true)
    );
  });

  test('a directory that does not exist should return false', () => {
    ['notExist', '/path/to/output3/'].forEach((path) => expect(validOutput(path)).toBe(false));
  });
});

describe('processConfig tests', () => {
  test('options should be overwritten with options in config file', () => {
    const MOCK_CONFIG_FILE = {
      '/path/to/ssg-config.json':
        '{"input": "../Sherlock","output": "./testDist2","stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css","lang": "fr"}',
    };

    fs.__setMockFiles(MOCK_CONFIG_FILE);
    const expectedOptions = {
      input: '../Sherlock',
      output: './testDist2',
      stylesheet: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
      config: '/path/to/ssg-config.json',
    };

    let options = {
      input: '',
      output: '',
      stylesheet: '',
      config: '/path/to/ssg-config.json',
    };

    processConfig(options);
    expect(options).toEqual(expectedOptions);
  });

  test('config files that can not be parsed correctly should throw new Error', () => {
    const MOCK_CONFIG_FILE = {
      '/path/to/ssg-config.json':
        '"input": "../Sherlock","output": "./testDist2","stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css","lang": "fr"',
    };

    fs.__setMockFiles(MOCK_CONFIG_FILE);

    let options = {
      input: '',
      output: '',
      stylesheet: '',
      config: '/path/to/ssg-config.json',
    };

    expect(() => {
      processConfig(options);
    }).toThrow(Error);
  });

  test('config files with the wrong filepath should throw new Error', () => {
    const MOCK_CONFIG_FILE = {
      '/path/to/ssg-config.json':
        '"input": "../Sherlock","output": "./testDist2","stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css","lang": "fr"',
    };

    fs.__setMockFiles(MOCK_CONFIG_FILE);

    let options = {
      input: '',
      output: '',
      stylesheet: '',
      config: '/path/to/ssg-config.wrong',
    };

    expect(() => {
      processConfig(options);
    }).toThrow(Error);
  });

  test('config files not stating input path should throw new Error', () => {
    const MOCK_CONFIG_FILE = {
      '/path/to/ssg-config.json':
        '{"output": "./testDist2","stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css","lang": "fr"}',
    };

    fs.__setMockFiles(MOCK_CONFIG_FILE);

    let options = {
      input: '',
      output: '',
      stylesheet: '',
      config: '/path/to/ssg-config.json',
    };

    expect(() => {
      processConfig(options);
    }).toThrow(
      `error: input <file or directory> is not specified in config file ${options.config}`
    );
  });
});

describe('processOptions tests', () => {
  const dist = 'path/to/dist';

  test('options with invalid output paths should be set to dist', () => {
    const expectedOptions = {
      input: '',
      output: dist,
      stylesheet: '',
      config: '',
    };

    let options = {
      input: '',
      output: 'notValid',
      stylesheet: '',
      config: '',
    };

    processOptions(options, dist);
    expect(options).toEqual(expectedOptions);
  });

  test('options with output paths equal to dist will remain as dist', () => {
    const expectedOptions = {
      input: '',
      output: dist,
      stylesheet: '',
      config: '',
    };

    let options = {
      input: '',
      output: dist,
      stylesheet: '',
      config: '',
    };

    processOptions(options, dist);
    expect(options).toEqual(expectedOptions);
  });

  test('options with valid output paths should not be set to dist', () => {
    const MOCK_FILE_OUTPUT_DIRECTORIES = {
      '/path/to/output1/': '',
    };

    fs.__setMockOutputDirectories(MOCK_FILE_OUTPUT_DIRECTORIES);

    const expectedOptions = {
      input: '',
      output: '/path/to/output1',
      stylesheet: '',
      config: '',
    };

    let options = {
      input: '',
      output: '/path/to/output1',
      stylesheet: '',
      config: '',
    };
    processOptions(options, dist);
    expect(options).toEqual(expectedOptions);
  });

  test('options with non existing inputs should throw new Error', () => {
    let options1 = {
      input: undefined,
      output: '',
      stylesheet: '',
      config: '',
    };

    let options2 = {
      input: null,
      output: '',
      stylesheet: '',
      config: '',
    };

    expect(() => {
      processOptions(options1);
    }).toThrow(`error: required option input <file or directory> is not specified`);
    expect(() => {
      processOptions(options2);
    }).toThrow(`error: required option input <file or directory> is not specified`);
  });

  test('options with non existing inputs should throw new Error', () => {
    const MOCK_CONFIG_FILE = {
      '/path/to/ssg-config.json':
        '{"input": "../Sherlock","stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css","lang": "fr"}',
      '/path/to/input/file': 'pathto input file',
    };

    fs.__setMockFiles(MOCK_CONFIG_FILE);

    const expectedOptions = {
      input: '../Sherlock',
      output: 'path/to/dist',
      stylesheet: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
      config: '/path/to/ssg-config.json',
    };

    let options = {
      input: '',
      output: '',
      stylesheet: '',
      config: '/path/to/ssg-config.json',
    };

    processOptions(options, dist);
    expect(options).toEqual(expectedOptions);
  });
});
