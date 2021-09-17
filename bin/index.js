#! /usr/bin/env node

const pkjson = require('../package.json');
const fs = require('fs');
const path = require('path');

//path to current directory for dist folder
const dist = process.cwd() + "/dist";
let outputPath = dist;

//tool options
const options =[
    {"long_option":"--version", "short_option":"-v", "args":"", "description":"Displays tool name and current version"},
    {"long_option":"--input", "short_option":"-i", "args":"<file or directory>", "description":"Designate an input file or directory"},
    {"long_option":"--output", "short_option":"-o", "args":"<directory>",  "description":"Designate an output directory, default ./dist"},
    {"long_option":"--stylesheet", "short_option":"-s", "args":"stylesheet URL",  "description":"Link a stylesheet URL"},
    {"long_option":"--help", "short_option":"-h", "description":"Lists all available options"},
]

let m_args = process.argv.slice(2);
let fileInd = 1;
let stylesheetUrl = "";

//determine and process options
switch(m_args[0]){
    case '--version':
    case '-v':
        console.log(' Name: ', pkjson.name);
        console.log(' Version: ', pkjson.version);
        break;
    case '--input':
    case '-i':
        checkArgs() //checks output and stylesheet options
        .then(()=>{
            processInput();
        }).catch((err)=>{console.log(err)});
        break;
    case '--help':
    case '-h':
        console.log(`Displaying tool options: `)
        options.forEach(option=>{
            console.log(`  ${option.short_option}, ${(option.long_option + " " + (option.args ? option.args : "")).padEnd(35, ' ')}  ${option.description}`);
        })
        break;
    default:
        let inputInd = m_args.findIndex(ele => ele == '--input' || ele == '-i');
        if(inputInd == -1){
            console.log("Unknown command, type --help or -h for command options");
        }else{
            fileInd = inputInd + 1;
            checkArgs().then(()=>{
                processInput();
            }).catch((err)=>{console.log(err)});
        }
        
}

//Checks validity of input file or directory
function processInput(){
    if(!m_args[fileInd]){
        console.log("Input file or directory name required");
    } 
    else if(!fs.existsSync(m_args[fileInd])){
        console.log(`Input file or directory ${m_args[fileInd]} doesn't exist.`);
    }
    else
    {
        fs.access(m_args[1], fs.constants.R_OK, (err)=>{
            if(err)
                console.log(`Can't access file or directory ${m_args[fileInd]}`);
            else{
                //Remove old output directory
                fs.rmdir(outputPath, {recursive: true, force: true}, (err)=>{
                    if(err) throw err;

                    //Create new output diretory
                    fs.mkdirSync(outputPath, {recursive: true});
                    
                    //Check if the input is a file or a directory
                    let fStats = fs.statSync(m_args[fileInd]);
                    if(fStats.isFile()){
                        createFile(m_args[fileInd]);
                    } else if (fStats.isDirectory()){
                        let files = findInDir(m_args[fileInd], ".txt");
                        let fileNames = [];
                        files.forEach(element => {
                            fileNames.push(path.basename(element, '.txt'));
                            createFile(element);
                        });
                        let indexContent = htmlContent(fileNames, "index");
                        fs.writeFileSync(outputPath+"/"+"index.html", indexContent, (err)=>{
                            if(err) throw err;
                        })
                    }
                });
            }
        });
    }
}

//Creates a single html file
function createFile(filepath){
    let filename = path.basename(filepath, '.txt');
    reader = fs.createReadStream(filepath);
    reader.on('data', (chunk)=>{
        let content = htmlContent(chunk.toString(), filename);
        fs.writeFileSync(outputPath+"/"+filename+".html", content, (err)=>{
            if(err) throw err;
        });
    });
}


//Creates html content
function htmlContent(data, filename){
    let title = "";
    let lines = [];
    if(typeof data === 'string'){
        lines = data.split(/\r?\n\r?\n/);
        let splitTitle = data.substr(0, 50).split(/\r?\n\r?\n\r?\n/);
        if(splitTitle.length > 1){
            title = splitTitle[0];
            lines.shift();
        }
    } else{
        title = "Generated Pages";
    }
    
    //Forming html with indents
    let htmlContent = '<!doctype html>'+
                        '\n\t<html lang="en">'+
                        '\n\t<head>' +
                        '\n\t\t<meta charset="utf-8">' +
                        `\n\t\t<title>${title != "" ? title : filename}</title>` +
                        `\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">`+
                        `${stylesheetUrl != "" ? `\n\t\t<link href=${stylesheetUrl} rel="stylesheet">` : ""}` +
                        '\n\t</head>'+
                        '\n\t<body>' +
                        `${title != "" ? `<h1>${title}</h1>`: ""}`;

    if(lines.length > 0){
        lines.forEach(ele =>{
            htmlContent += `\n\t\t<p>${ele}</p>`
        });
    }
    else if(Array.isArray(data)){
        data.forEach(ele =>{
            if(ele)
                htmlContent += `\n\t\t<h2>\n\t\t\t<a href="./${ele}.html">${ele}</a>\n\t\t</h2>`;
        });
    }
    
    htmlContent += '\n\t</body>\n</html>';

    return htmlContent;
}

function findInDir(filepath, extension){
    let results =[];
    let files=fs.readdirSync(filepath);
    for(let i = 0; i < files.length; ++i){
        let filename = path.join(filepath,files[i]);
        let stat = fs.lstatSync(filename);
        if(stat.isDirectory()){
            results = results.concat(findInDir(filename, extension));
        }
        else if(filename.indexOf(extension) >=0){
            results.push(filename);
        }
    } 
    return results;
}

//checks arguments for output or stylsheet options
function checkArgs(){
    return new Promise((res, rej) =>{
        let outputInd = m_args.findIndex(ele => (ele == '--output' || ele == '-o'));
        let styleInd = m_args.findIndex(ele => (ele == '--stylesheet' || ele == '-s'));

        //if --output or -o options exist
        if(outputInd != -1){
            // argument after the options should be the designated output directory
            let outDirInd = outputInd + 1;
            if(m_args[outDirInd]){
                if(fs.existsSync(m_args[outDirInd])){
                    outputPath = m_args[outDirInd];
                }
                else{
                    console.log(`Output directory ${m_args[outDirInd]} doesn't exist, outputting all files to ./dist`);
                }
            }
        }

        //if stylesheet option exists
        if(styleInd != -1){
            // argument after the option should be the stylesheet url
            let styleUrlInd = styleInd + 1;
            if(m_args[styleUrlInd]){
                stylesheetUrl = m_args[styleUrlInd];
            }
            else{
                console.log(`Stylesheet url doesn't exist, using default stylesheet`);
            }
        }
        res();
    });
}