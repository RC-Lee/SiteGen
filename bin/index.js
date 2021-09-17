#! /usr/bin/env node

const pkjson = require('../package.json');
const fs = require('fs');
const path = require('path');

//path to current directory for dist folder
const dist = process.cwd() + "/dist";
let outputPath = dist;

//tool options
const options =[
    {"long_option":"--version", "short_option":"-v", "description":"Displays tool name and current version"},
    {"long_option":"--input", "short_option":"-i", "description":"Designate an input file or directory"},
    {"long_option":"--output", "short_option":"-o", "description":"Designate an output directory, default ./dist"},
    {"long_option":"--help", "short_option":"-h", "description":"Lists all available options"},
]

let m_args = process.argv.slice(2);
switch(m_args[0]){
    case '--version':
    case '-v':
        console.log(' Name: ', pkjson.name);
        console.log(' Version: ', pkjson.version);
        break;
    case '--input':
    case '-i':
        checkOutput().then(()=>{
            checkInput();
        }).catch((err)=>{console.log(err)});
        break;
    case '--help':
    case '-h':
        console.log(`Displaying tool options: `)
        options.forEach(option=>{
            console.log(`  ${option.long_option.padEnd(12, ' ')} ${option.short_option.padEnd(5, ' ')} ${option.description}`);
        })
        break;
    default:
        console.log("Unknown command, type --help or -h for command options");
}

//Checks validity of input file or directory
function checkInput(){
    if(!m_args[1]){
        console.log("Input file or directory name required");
    } 
    else if(!fs.existsSync(m_args[1])){
        console.log(`Input file or directory ${m_args[1]} doesn't exist.`);
    }
    else
    {
        fs.access(m_args[1], fs.constants.R_OK, (err)=>{
            if(err)
                console.log(`Can't access file or directory ${m_args[1]}`);
            else{
                //Remove old output directory
                fs.rmdir(outputPath, {recursive: true, force: true}, (err)=>{
                    if(err) throw err;

                    fs.mkdirSync(outputPath, {recursive: true});
        
                    let fStats = fs.statSync(m_args[1]);
                    if(fStats.isFile()){
                        createFile(m_args[1]);
                    } else if (fStats.isDirectory()){
                        files = findTxTInDir(m_args[1], ".txt");
                        files.forEach(element => {
                            createFile(element);
                        });
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
        })
    });
}

//Creates html content
function htmlContent(data, filename){
    let lines = data.split(/\r\n\r\n/);
    let splitTitle = data.split(/\r\n\r\n\r\n/);
    let hasTitle = false;
    if(splitTitle.length > 1){
        hasTitle = true;
        lines.shift();
    }
        
    return `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${hasTitle? splitTitle[0] : filename}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    ${hasTitle ? `<h1>${splitTitle[0]}</h1>`: ""}
    ${lines.map((ele)=>{
        return  "<p>" + ele + "</p>\n\t\t" ;
    }).join("")}
    </body>
    </html>`
}

function findTxTInDir(filepath, extension){
    let results =[];
    let files=fs.readdirSync(filepath);
    for(let i = 0; i < files.length; ++i){
        let filename = path.join(filepath,files[i]);
        let stat = fs.lstatSync(filename);
        if(stat.isDirectory()){
            results = results.concat(findTxTInDir(filename, extension));
        }
        else if(filename.indexOf(extension) >=0){
            results.push(filename);
        }
    } 
    return results;
}

function checkOutput(){
    return new Promise((res, rej) =>{
        if(m_args[2] == "--output" || m_args[2] == "-o"){
            if(m_args[3]){
                if(fs.existsSync(m_args[3])){
                    outputPath = m_args[3];
                }
                else{
                    console.log(`Output directory ${m_args[3]} doesn't exist, outputting all files to ./dist`);
                }
            }
        }
        res();
    });
}