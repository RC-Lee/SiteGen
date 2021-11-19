const { run } = require('./run');

describe('end-to-end integration', () => {
  test('prints error and help message when no arguments given', async () => {
    const { stderr, stdout, exitCode } = await run();
    const errorMsg = 'error: required option input <file or directory> is not specified';
    expect(exitCode === 0).toBeFalsy();
    expect(stderr.includes(errorMsg)).toBeTruthy();
    expect(stdout).toEqual('');
  });

  test('prints help message when --help given', async () => {
    const { stderr, stdout, exitCode } = await run('--help');
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('prints version message when --version given', async () => {
    const { stderr, stdout, exitCode } = await run('--version');
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('single valid text file input should generate an html', async () => {
    const { stderr, stdout, exitCode } = await run('--input', './test/sample.txt');
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('single valid text file input should generate an html', async () => {
    const { stderr, stdout, exitCode } = await run(
      '--input',
      './test/sample.txt',
      '--stylesheet',
      'link'
    );
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('single valid text file input with valid output folder should generate an html in said folder', async () => {
    const { stderr, stdout, exitCode } = await run(
      '--input',
      './test/sample.txt',
      '--output',
      './test/outputTest'
    );
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });

  test('single valid text file input with invalid output folder should generate an html in ./dist', async () => {
    const { stderr, stdout, exitCode } = await run(
      '--input',
      './test/sample.txt',
      '--output',
      './test/invalid'
    );
    expect(exitCode).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toEqual('');
  });
});
