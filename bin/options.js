const fs = require('fs');
const path = require('path');
const dist = path.join(process.cwd(), 'dist');

function processOptions(options) {
  //Config file option
  if (options.config !== undefined && options.config !== '' && options.config !== null) {
    processConfig(options);
  }

  //Output option
  if (options.output !== dist) {
    options.output = validOutput(options.output) ? options.output : dist;
  }

  //Input option
  if (options.input === undefined || options.input === null) {
    throw new Error(`error: required option input <file or directory> is not specified`);
  }
}

function processConfig(options) {
  try {
    let configData = fs.readFileSync(options.config);
    let configOptions = JSON.parse(configData);
    for (const [key] of Object.entries(options)) {
      if (key !== 'config')
        configOptions[`${key}`]
          ? (options[`${key}`] = configOptions[`${key}`])
          : (options[`${key}`] = undefined);
    }
    if (!options.input) {
      throw new Error(
        `error: input <file or directory> is not specified in config file ${options.config}`
      );
    }
  } catch (error) {
    throw new Error(`Can't read or parse config file ${options.config}\n ${error}`);
  }
}

function validOutput(outputPath) {
  if (!outputPath || outputPath === '') return false;

  if (!fs.existsSync(outputPath)) {
    console.log(`Output directory ${outputPath} doesn't exist, outputting all files to ./dist`);
    return false;
  }
  return true;
}

module.exports.processOptions = processOptions;
module.exports.processConfig = processConfig;
module.exports.validOutput = validOutput;
