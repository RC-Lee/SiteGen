# SiteGen

## About

A basic Static Site Generator that converts .txt files to .html files.
Current release 0.1 with the following features.

## Features

- (Required) Allows the user to specify an input file or folder to be processed.
- Allows the input to be a deep tree of files and folders, all .txt files are recursively parsed.
- Parsed titles (if any) from input files.
- Allows specification of a different output directory
- Allows specification of a stylesheet through linking a stylesheet URL
- Automatically generates an index.html file with relative links to each of the generated html files
- Markdown support: header(1,2,3), link, bold text, italic text, inline code, horizontal rule
- Config JSON file cotaining SSG options support

## Development

Please read `CONTRIBUTING.md`

## Tool options

```
  -v, --version                              Displays tool name and current version
  -i, --input <file or directory name>       Designate an input file or directory
  -o, --output <directory name>              Designate an output directory, default ./dist
  -s, --stylesheet <stylesheet URL>          Link a stylesheet URL to the html
  -c, --config <file>                        Read and parse json properties from file as options.
  -h, --help                                 Lists all available options
```

---

### Version option example

`sitegen -v` or `sitegen --version` will display the tool name and current version.

```
  Name:  sitegen
  Version:  0.1.0
```

---

### Help option example

`sitegen -h` or `sitegen --help` will list the tool options as listed above.

---

### Input option examples

```
 sitegen -i filename
 sitegen --input "directory name"
 sitegen -i relative-or-absolute-path-to-file-or-directory
```

This is the main processing option for the site generator tool.

The file or directory name must follow the input option.

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

The order for using options doesn't matter, **but** the file, directory or url has to follow the used option.

In the case that an output directory isn't indicated or valid, the generator will create files in a default ./dist folder in the current working directory.

---

## Markdown

The tool supports Markdown (.md) files with full Markdown support from Remarkable

---

## Config file:

The tool supports `.json` config file

### Usage

```sh
sitegen -c config.json
```

Reading and parsing json properties as options for `sitegen`
**Note**: if `-c` exists, other options are be ignored.

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
