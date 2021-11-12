const { Remarkable } = require('remarkable');

function markdownContent(metadata, data) {
  let separated = separateFrontMatter(data);
  parseFrontMatter(metadata, separated[0]);
  let bodyContent = changeMetaDataInMd(metadata, separated[1]);
  const md = new Remarkable('full', {
    html: true,
  });
  return md.render(bodyContent);
}

function separateFrontMatter(data) {
  if (data.startsWith('---')) {
    //there is meta data
    let splitData = data.split('---', 3);
    if (splitData.length != 3 || splitData[0] != '') {
      console.error(`error: metaData doesn't seem to be formatted correctly`);
    }
    //Should add more parsing requirements,
    //for example, if they forgot to add the second '---' after meta data
    //and it shows up as a horizontal line later down the file,
    //This would cause problems

    splitData.shift();
    //splitData[1] is metaData
    //splitData[2] is bodyData
    return splitData;
  } else {
    return ['', data];
  }
}

function parseFrontMatter(metadata, data) {
  //metaData = ['id', 'title', 'hide_title', 'description', 'stylesheet', 'image'];
  let splitData = data.split(/\r?\n/);
  splitData.map((line) => {
    if (line != '') {
      let splitLine = line.split(': ', 2);
      if (splitLine.length > 1 && Object.prototype.hasOwnProperty.call(metadata, splitLine[0])) {
        if (splitLine[0] === 'hide_title')
          metadata[splitLine[0]] =
            splitLine[1] === true || splitLine[1] === false ? splitLine[1] : false;
        else metadata[splitLine[0]] = splitLine[1];
      }
    }
  });
}

function changeMetaDataInMd(metaData, data) {
  for (let key in metaData) {
    if (metaData[key] != '') {
      let regStr = ` {{ ${key} }}`;
      let replacement = ` ${metaData[key]} `;
      let re = new RegExp(regStr, 'gim');
      data = data.replace(re, replacement);
    }
  }
  return data;
}

module.exports.markdownContent = markdownContent;
