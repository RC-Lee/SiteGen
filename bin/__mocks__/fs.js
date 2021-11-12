'use strict';

const path = require('path');

const fs = jest.createMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const [file, data] of Object.entries(newMockFiles)) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir][path.basename(file)] = data;
  }
}

function __setMockOutputDirectories(outPutPaths) {
  for (const [outputPath, files] of Object.entries(outPutPaths)) {
    const dir = path.join(path.dirname(outputPath), path.basename(outputPath));
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(files);
  }
}

// A custom version of `readFileSync` that reads from the special mocked out
// file list set via __setMockFiles
function readFileSync(file) {
  const data = mockFiles[path.dirname(file)][path.basename(file)];
  if (data) return data;
  else throw 'unexpected filepath';
}

// Custom version of existsSync
function existsSync(directoryPath) {
  const dir = path.join(path.dirname(directoryPath), path.basename(directoryPath));
  return !!mockFiles[dir];
}

fs.__setMockFiles = __setMockFiles;
fs.__setMockOutputDirectories = __setMockOutputDirectories;
fs.readFileSync = readFileSync;
fs.existsSync = existsSync;

module.exports = fs;
