#! /usr/bin/env node
const pkjson = require('../package.json');
const path = require('path');
const { Command } = require('commander');
const { processOptions } = require('./options');
const { Data } = require('./data');

function main() {
  const dist = path.join(process.cwd(), 'dist');
  const program = new Command();
  program
    .version(
      `Name: ${pkjson.name} \nVersion: ${pkjson.version}`,
      '-v, --version',
      'Output the current version'
    )
    .option('-i, --input <file or directory>', 'Designate an input file or directory')
    .option('-o, --output <directory>', 'Designate an ouput directory')
    .option(
      '-s, --stylesheet <stylesheet url>',
      'Link to a stylesheet url',
      'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css'
    )
    .option('-c, --config <config json file>', 'Link to file that specifies all SSG options')
    .showHelpAfterError();
  program.parse(process.argv);
  const programOpts = program.opts();
  let dataOptions = {
    input: programOpts.input,
    output: programOpts.output,
    stylesheet: programOpts.stylesheet,
    config: programOpts.config,
  };
  processOptions(dataOptions, dist);

  let inputData = new Data(dataOptions.input, dataOptions.output, dataOptions.stylesheet);
  inputData.processInput();
}

main();
