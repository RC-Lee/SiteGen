const path = require('path');
const { markdownContent } = require('./markdown');

class File {
  constructor(filePath = '', extension = '') {
    this.filePath_ = filePath;
    this.extension_ = extension;
    this.fileName_ = '';
    this.metaData = {
      id: '',
      title: '',
      hide_title: false,
      description: '',
      stylesheet: '',
      image: '',
    };
    if (filePath.endsWith(extension)) this.fileName_ = path.basename(filePath, extension);
    else {
      console.error(`error getting filename from file ${path}`);
      process.exit(-1);
    }
  }

  getFilePath() {
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
  toHtml(data, stylesheetUrl = '') {
    let title = '';
    let bodyContent = '';
    //Processing files ending with extensions in the extensions array
    if (this.extension_ == '.txt') {
      let lines = data.split(/\r?\n\r?\n\r?\n/);
      if (lines.length > 1) {
        title = lines[0];
        lines.shift();
      }
      bodyContent += lines[0]
        .split(/\r?\n\r?\n/g)
        .map((line) => `\r\n\t\t<p>${line}</p>`)
        .join('\n');
    } else if (this.extension_ == '.md') {
      bodyContent = markdownContent(this.metaData, data);
    } else {
      throw new Error(`error: ${this.extension_} is not a file type that can be processed`);
    }

    return getHtmlContent(title, stylesheetUrl, bodyContent);
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
function getHtmlContent(title = '', stylesheetUrl = '', bodyContent = '') {
  let htmlContent =
    '<!doctype html>' +
    '\r\n\t<html lang="en">' +
    '\r\n\t<head>' +
    '\r\n\t\t<meta charset="utf-8">' +
    `\r\n\t\t<title>${title != '' ? title : ''}</title>` +
    `\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `${stylesheetUrl != '' ? `\r\n\t\t<link href="${stylesheetUrl}" rel="stylesheet">` : ''}` +
    '\r\n\t</head>' +
    '\r\n\t<body>' +
    `${title != '' ? `\r\n\t\t<h1>${title}</h1>` : ''}` +
    `${bodyContent}` +
    '\r\n\t</body>\r\n</html>';

  return htmlContent;
}

module.exports.File = File;
module.exports.getHtmlContent = getHtmlContent;
