#! /usr/bin/env node

const pkjson = require('../package.json');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const { Data } = require('./data')

function processOptions(){
    const dist = path.join(process.cwd(), "dist");
    const program = new Command();
    program
        .version(`Name: ${pkjson.name} \nVersion: ${pkjson.version}`, '-v, --version', 'Output the current version')
        .option('-i, --input <file or directory>', 'Designate an input file or directory')
        .option('-o, --output <directory>', 'Designate an ouput directory', dist)
        .option('-s, --stylesheet <stylesheet url>', 'Link to a stylesheet url', '')
        .option('-c, --config <config json file>', 'Link to file that specifies all SSG options')
        .showHelpAfterError();
    program.parse(process.argv);
    const options = program.opts();
    
    let outputPath = dist;
    let stylesheetUrl;
    //Config file option
    if(options.config !== undefined) {
        try {
            let configData = fs.readFileSync(options.config);
            let configOptions = JSON.parse(configData); 
            for(const [key, value] of Object.entries(configOptions)) {
                value || value.length > 0 ? options[`${key}`] = `${value}` : options[`${key}`] = undefined;
            }
            if(!options.input) {
                console.error(`error: input <file or directory> is not specified in config file ${options.config}`);
                process.exit(-1);
            }
        } catch(error) {
            onsole.error(`Can't read or parse config file ${options.config}\n ${error}`);
            process.exit(-1);
        }
    }

    //Output option
    if(options.output !== dist){
        if(fs.existsSync(options.output)){
            outputPath = options.output;
        }
        else{
            console.log(`Output directory ${options.output} doesn't exist, outputting all files to ./dist`);
        }
    }
    //Stylesheet option
    if(options.stylesheet !== undefined)
        stylesheetUrl = options.stylesheet;
    //Input option
    if(options.input !== undefined){
        let inputData = new Data(options.input, outputPath, stylesheetUrl);
        inputData.processInput();
    }
    else {
        console.error("error: required option input <file or directory> is not specified");
        process.exit(-1);
    }
}

processOptions();