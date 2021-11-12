const { File, getHtmlContent } = require('./file');

describe('getHtmlContent tests', () => {
  test('function call with no inputs should have the right output string', () => {
    const expectedResult =
      '<!doctype html>' +
      '\r\n\t<html lang="en">' +
      '\r\n\t<head>' +
      '\r\n\t\t<meta charset="utf-8">' +
      `\r\n\t\t<title></title>` +
      `\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">` +
      '\r\n\t</head>' +
      '\r\n\t<body>' +
      '\r\n\t</body>\r\n</html>';

    expect(getHtmlContent()).toEqual(expectedResult);
  });

  test('function call with inputs should have correct output string', () => {
    const title = `Test Title`;
    const stylesheetUrl = `testStylesheet`;
    const bodyContent = `testContent`;

    const expectedResult =
      '<!doctype html>' +
      '\r\n\t<html lang="en">' +
      '\r\n\t<head>' +
      '\r\n\t\t<meta charset="utf-8">' +
      `\r\n\t\t<title>${title}</title>` +
      `\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1">` +
      `\r\n\t\t<link href="${stylesheetUrl}" rel="stylesheet">` +
      '\r\n\t</head>' +
      '\r\n\t<body>' +
      `\r\n\t\t<h1>${title}</h1>` +
      `${bodyContent}` +
      '\r\n\t</body>\r\n</html>';

    expect(getHtmlContent(title, stylesheetUrl, bodyContent)).toEqual(expectedResult);
  });
});

describe('File tests', () => {
  test('getFilePath should return filepath', () => {
    let file = new File('/abc.txt', '.txt');

    expect(file.getFilePath()).toEqual('/abc.txt');
  });

  test('Files not with extension .txt and .md throws error', () => {
    let file = new File('/abc.t', '.t');

    expect(() => {
      file.toHtml('Hello');
    }).toThrow(`error: .t is not a file type that can be processed`);
  });

  test('Text files with a title separated by two lines should be parsed correctly', () => {
    let file = new File('abc.txt', '.txt');

    const data = 'Title\r\n\r\n\r\nbody';

    let result = file.toHtml(data);

    const expectedResult = getHtmlContent('Title', '', '\r\n\t\t<p>body</p>');

    expect(result).toEqual(expectedResult);
  });
});
