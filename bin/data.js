const { Transform } = require('stream');
const fs = require('fs');
const path = require('path');

class Data{
    inputPath_;
    outputPath_;
    stylesheetUrl_;
    extensions = [".txt", ".md"];

    constructor(inputPath, outputPath, stylesheetUrl){
        if(!fs.existsSync(inputPath)){
            console.error(`Input file or directory "${inputPath}" doesn't exist.`);
            process.exit(-1);
        }
        this.inputPath_ = inputPath;
        this.outputPath_ = outputPath;
        this.stylesheetUrl_ = stylesheetUrl;
    }

    /*
      Method processes the input data
    */
    processInput(){
        fs.access(this.inputPath_, fs.constants.R_OK, (err)=>{
            if(err){
                console.error(`Can't access file or directory ${this.inputPath_}`);
                process.exit(-1);
            }
            else{
                //Remove old output directory
                fs.rmdir(this.outputPath_, {recursive: true, force: true}, (err)=>{
                    if(err){
                        console.error(`Error removing directory at "${this.outputPath_}`);
                        process.exit(-1);
                    }

                    //Create new output directory
                    fs.mkdirSync(this.outputPath_, {recursive: true});
                    
                    //Check if the input is a file or a directory
                    let fStats = fs.statSync(this.inputPath_);
                    //if the input is a file
                    if(fStats.isFile()){
                        this.extensions.forEach(extension =>{
                            if(this.inputPath_.endsWith(extension)){
                                let tempFile = new File(this.inputPath_, extension);
                                this.createFile(tempFile);
                            }
                        });
                    //if the file is a directory
                    } else if (fStats.isDirectory()){
                        let fileNames = [];
                        this.extensions.forEach(extension => {
                            fileNames = fileNames.concat(this.processFiles(extension));
                        });

                        // Creating index.js for files
                        let indexContent = this.CreateIndexHtml(fileNames);
                        fs.writeFileSync(path.join(this.outputPath_,"index.html"), indexContent, (err)=>{
                            if(err){
                                console.error(`Error creating index.html file`);
                                process.exit(-1);
                            }
                        });
                    }
                });//end of fs.rmdir
            }
        });//end of fs.access
    }

    /*
    Method Creates html files from all files within the tree of directories ending with extension.

    Parameters:
    extension - string: extension of files to parse to html

    Return:
    fileNames - array<String>: array of filenames parsed to html.
    */
    processFiles(extension){
        let files = this.findInDir(this.inputPath_, extension);
        let fileNames = [];
        if(Array.isArray(files)){
            files.forEach(file => {
                fileNames.push(path.basename(file, extension));
                let tempFile = new File(file, extension);
                this.createFile(tempFile);
            });
        }
    
        return fileNames;
    }

    /*
    Function finds all files ending with extension in a tree of directories

    Parameters:
    filepath - string: filepath of file or directory
    extension - string: extension of files to parse to html

    Return:
    results - array<string>: array consisting all filepaths of files ending with extension in a tree of directories
    */
    findInDir(filepath, extension){
        let results =[];
        let files=fs.readdirSync(filepath);
        for(let i = 0; i < files.length; ++i){
            let filename = path.join(filepath,files[i]);
            let stat = fs.lstatSync(filename);
    
            //recursively find all files ending with extension
            if(stat.isDirectory()){
                results = results.concat(findInDir(filename, extension));
            }
            else{
                if(filename.endsWith(extension))
                    results.push(filename);
            }
        } 
        return results;
    }

    createFile(file){
        let stylesheetUrl = this.stylesheetUrl_;
        let readStream = fs.createReadStream(file.getFilePath());
        readStream.setEncoding("utf8");
        readStream.on("data", () =>{});
        readStream.on("end", ()=>{});
        readStream.on("error", (err) =>{
                console.error(`ReadStream encountered an error: ${err}`);
                process.exit(-1);
            });
    
        let writeStream = fs.createWriteStream(path.join(this.outputPath_, file.fileName_.replace(/\s+/g, '_')+".html"));
        writeStream.on("finish", ()=>{});
        writeStream.on("error", (err) =>{
            console.error(`WriteStream encountered an error: ${err}`);
            writeStream.end();
            process.exit(-1);
        });
    
        let toHtmlStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback){
                this.push(file.toHtml(chunk.toString()), stylesheetUrl);
                return callback();
            },
        });
        toHtmlStream.on('error', (err) =>{
            console.error(`toHtmlStream encountered an error: ${err}`);
            process.exit(-1);
        });
    
        //Piping data
        readStream.pipe(toHtmlStream).pipe(writeStream);
    }

    CreateIndexHtml(filenames){
        let title = "Generated Pages"
        let bodyContent = "";
    
        filenames.forEach(filename =>{
            if(typeof filename === 'string')
                bodyContent += `\r\n\t\t<h2>\r\n\t\t\t<a href="./${filename.replace(/\s+/g, '_')}.html">${filename}</a>\r\n\t\t</h2>`;
        });
    
        return getHtmlContent(title, this.stylesheetUrl_, bodyContent);
    }
}

class File{
    filePath_ = "";
    extension_ = "";
    fileName_ = "";

    constructor(filePath, extension){
        if(filePath.endsWith(extension))
            this.fileName_ = path.basename(filePath, extension);
        else{
            console.error(`error getting filename from file ${path}`);
            process.exit(-1);
        }

        this.filePath_ = filePath;
        this.extension_ = extension;
    }

    getFilePath(){
        return this.filePath_;
    }

    /*
    Method gets the htmlContent to be written into html files

    Parameters:
    data - string/array<string>: Data to be processed for html files
    stylesheetUrl - <string> stylesheet Url

    Return:
    htmlContent - string: content string to be written into files
    */
    toHtml(data, stylesheetUrl = ""){
        let title = "";
        let bodyContent = "";
        //Processing files ending with extensions in the extensions array
        if (typeof data === "string" && this.extension_ == ".txt") {
            let lines = data.split(/\r?\n\r?\n\r?\n/);
            if(lines.length > 1){
                title = lines[0];
                lines.shift();
            }
            bodyContent += lines[0].split(/\r?\n\r?\n/g).map(line => `\r\n\t\t<p>${line}</p>`).join("\n");
        } else if(typeof data == "string" && this.extension_ == ".md") {
            bodyContent = this.markdownContent(data);
        }

        return getHtmlContent(title, stylesheetUrl, bodyContent);
    }
    
    markdownContent(data) {
        // Using replace method on string & regular expression 
        let convertedText = data
            .replace(/^# (.*$)/gim, '<h1>$1</h1>') // Heading 1 
            .replace(/^### (.*$)/gim, '<h3>$1</h3>') // Heading 3 
            .replace(/^## (.*$)/gim, '<h2>$1</h2>') // Heading 2
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // Bold
            .replace(/\*(.*)\*/gim, '<i>$1</i>') // Italic
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // Bold nested in Italic
            .replace(/\*(.*)\*/gim, '<i>$1</i>') // Italic nested in Bold
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>") // Link 
            .replace(/`(.*?)`/gim, '<code>$1</code>') //inline code
            .replace(/-{3,}$/gim, '<hr>') // Horizontal Rule
            .replace(/\n$/gim, '<br />') // Break line
    
        return convertedText
    }
}

/*
    Functions generates html block

    Parameters:
    title - <string>: html title
    stylesheetUrl - <string> stylesheet Url
    bodyContent - <string> html body

    Return:
    htmlContent - string: content string to be written into files
 */
function getHtmlContent(title, stylesheetUrl, bodyContent){
    let htmlContent = '<!doctype html>'+
    '\r\n\t<html lang="en">'+
    '\r\n\t<head>' +
    '\r\n\t\t<meta charset="utf-8">' +
    `\r\n\t\t<title>${title != "" ? title : ""}</title>` +
    `\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">`+
    `${stylesheetUrl != "" ? `\r\n\t\t<link href="${stylesheetUrl}" rel="stylesheet">` : ""}` +
    '\r\n\t</head>'+
    '\r\n\t<body>' +
    `${title != "" ? `\r\n\t\t<h1>${title}</h1>`: ""}`+
    `${bodyContent}`+
    '\r\n\t</body>\r\n</html>';

    return htmlContent;
}

module.exports.Data = Data;