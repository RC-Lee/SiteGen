const fs = require('fs');
const path = require('path');
const { File, getHtmlContent } = require('./file');

class Data {
  constructor(inputPath, outputPath, stylesheetUrl = '') {
    this.inputPath_ = '';
    this.outputPath_ = '';
    this.stylesheetUrl_ = '';
    this.extensions = ['.txt', '.md'];
    if (!fs.existsSync(inputPath)) {
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
  processInput() {
    fs.access(this.inputPath_, fs.constants.R_OK, (err) => {
      if (err) {
        console.error(`Can't access file or directory ${this.inputPath_}`);
        process.exit(-1);
      } else {
        //Remove old output directory
        fs.rm(this.outputPath_, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error removing directory at "${this.outputPath_}`);
            process.exit(-1);
          }

          //Create new output directory
          fs.mkdirSync(this.outputPath_, { recursive: true });

          //Check if the input is a file or a directory
          let fStats = fs.statSync(this.inputPath_);
          //if the input is a file
          if (fStats.isFile()) {
            this.extensions.forEach((extension) => {
              if (this.inputPath_.endsWith(extension)) {
                this.createFile(new File(this.inputPath_, extension));
              }
            });
            //if the file is a directory
          } else if (fStats.isDirectory()) {
            let fileNames = [];
            this.extensions.forEach((extension) => {
              fileNames = fileNames.concat(this.processFiles(extension));
            });

            // Creating index.js for files
            let indexContent = this.createIndexHtml(fileNames);
            fs.writeFileSync(path.join(this.outputPath_, 'index.html'), indexContent, (err) => {
              if (err) {
                console.error(`Error creating index.html file`);
                process.exit(-1);
              }
            });
          }
        }); //end of fs.rmdir
      }
    }); //end of fs.access
    process.exitCode = 0;
  }

  /*
    Method Creates html files from all files within the tree of directories ending with extension.

    Parameters:
    extension - string: extension of files to parse to html

    Return:
    fileNames - array<String>: array of filenames parsed to html.
    */
  processFiles(extension) {
    let files = this.recursiveFindFiles(this.inputPath_, extension);
    let fileNames = [];
    if (Array.isArray(files)) {
      files.forEach((file) => {
        fileNames.push(path.basename(file, extension));
        this.createFile(new File(file, extension));
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
  recursiveFindFiles(filepath, extension) {
    let results = [];
    let files = fs.readdirSync(filepath);
    for (let i = 0; i < files.length; ++i) {
      let filename = path.join(filepath, files[i]);
      let stat = fs.lstatSync(filename);

      //recursively find all files ending with extension
      if (stat.isDirectory()) {
        results = results.concat(this.recursiveFindFiles(filename, extension));
      } else {
        if (filename.endsWith(extension)) results.push(filename);
      }
    }
    return results;
  }

  createFile(file) {
    let data = fs.readFileSync(file.getFilePath(), 'utf-8');
    let htmlContent = file.toHtml(data, this.stylesheetUrl_);
    let newFilePath = path.join(this.outputPath_, file.fileName_.replace(/\s+/g, '_') + '.html');
    fs.appendFileSync(newFilePath, htmlContent);
  }

  createIndexHtml(filenames) {
    let title = 'Generated Pages';
    let bodyContent = '';

    filenames.forEach((filename) => {
      if (typeof filename === 'string')
        bodyContent += `\r\n\t\t<h2>\r\n\t\t\t<a href="./${filename.replace(
          /\s+/g,
          '_'
        )}.html">${filename}</a>\r\n\t\t</h2>`;
    });

    return getHtmlContent(title, this.stylesheetUrl_, bodyContent);
  }
}

module.exports.Data = Data;
