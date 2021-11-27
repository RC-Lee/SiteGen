# OSD-SiteGen

## About

A basic Static Site Generator that converts `.txt` and `.md` files to `.html` files.
Current release 1.0.0 on npm with the following features.

## Features

- Allows the user to specify an input file or input folder to be processed.
- Allows the input to be a deep tree of files and folders, all `.txt` and `.md` files are recursively parsed.
- Parsed titles (if any) from input `.txt` files.
- Allows specification of a different output directory. If there's no directory specified, a `dist` folder will be created in the current working directory to store the generated `html` file(s).
- Allows specification of a stylesheet through linking a stylesheet URL
- Automatically generates an index.html file with relative links to each of the generated html files
- Markdown support: Full markdown support through [Remarkable](https://github.com/jonschlinkert/remarkable)
- Supports parsing of config JSON files containing SSG options

## Development

For interest in developments please read [`CONTRIBUTING.md`](https://github.com/rclee91/SiteGen/blob/main/CONTRIBUTING.md)

## Installation

1. Make sure you have [npm](https://www.npmjs.com/) installed
2. Please make sure you have the latest version of [Node](https://nodejs.org/en/) ("v16.13.0")
3. run the following in terminal or command line

```sh
npm install -g osd-sitegen
```

Head to any directory you wish for the default `/dist` folder to be generated in, then run the tool options below.

To uninstall run

```sh
npm uninstall -g osd-sitegen
```

## Tool options

```sh
  -v, --version                              Displays tool name and current version
  -i, --input <file or directory name>       Designate an input file or directory
  -o, --output <directory name>              Designate an output directory, default ./dist
  -s, --stylesheet <stylesheet URL>          Link a stylesheet URL to the html
  -c, --config <file>                        Read and parse json properties from file as options.
  -h, --help                                 Lists all available options
```

---

### Version option example

`osd-sitegen -v` or `osd-sitegen --version` will display the tool name and current version.

```text
  Name:  osd-sitegen
  Version:  1.0.0
```

---

### Help option example

`osd-sitegen -h` or `osd-sitegen --help` will list the tool options as listed above.

---

### Input option examples

```sh
 osd-sitegen -i filename
 osd-sitegen --input "directory name"
 osd-sitegen -i relative-or-absolute-path-to-file-or-directory
```

This is the main processing option for the site generator tool.

In the case of spaces in file or directory names, quotation marks "" are needed to wrap around the name.

---

### Output and Stylesheet option examples

Sample code for using output and stylesheet options below:

```
 sitegen -i filename -o relative-or-absolute-path-directory
 sitegen -i filename -s "stylesheet url"
 sitegen -i filename -o relative-or-absolute-path-directory -s "stylesheet url"
 sitegen -s "stylesheet url" -i filename -o relative-or-absolute-path-directory
```

In the case that an output directory isn't indicated or valid, the generator will create files in a default `./dist` folder in the current working directory.

---

## Markdown

The tool supports Markdown (.md) files with full Markdown support from [Remarkable](https://github.com/jonschlinkert/remarkable)

---

## Config file:

The tool supports `.json` config file

### Usage

```sh
osd-sitegen -c config.json
```

Reading and parsing json properties as options for `osd-sitegen`
**Note**: if `-c` exists, other options will be ignored.

### Example.json

```json
{
  "input": "./testfiles",
  "output": "./output",
  "stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
  "lang": "en"
}
```

---

## Special thanks to

[Andrei Batomunkuev](https://github.com/abatomunkuev) <br/>
[Tue Nguyen](https://github.com/TueNguyen2911)

## Generated Pages live example

[Link to the example webpage](https://rclee91.github.io/SiteGen/)
