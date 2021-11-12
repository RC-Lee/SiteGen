const execa = require('execa');

// Execute the purl command with the given options and arguments
async function run(...args) {
  try {
    const result = await execa.node('./bin/index.js', args);
    return result;
  } catch (err) {
    return err;
  }
}

module.exports.run = run;
