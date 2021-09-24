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


## Tool options
```
  -v, --version                              Displays tool name and current version
  -i, --input <file or directory name>       Designate an input file or directory
  -o, --output <directory name>              Designate an output directory, default ./dist
  -s, --stylesheet <stylesheet URL>          Link a stylesheet URL to the html
  -h, --help                                 Lists all available options
```

## How to use
Note, this release has not yet been published on npm.

In terminal or console, head to the main sitegen directory and call
`npm install -g`

### Dependencies
Commander: `npm install commander`

----
### Version option example
`sitegen -v` or `sitegen --version` will display the tool name and current version.
```
  Name:  sitegen
  Version:  0.1.0
```

----
### Help option example
`sitegen -h` or `sitegen --help` will list the tool options as listed above.

----
### Input option examples
```
 sitegen -i filename
 sitegen --input "directory name"
 sitegen -i relative-or-absolute-path-to-file-or-directory
```
This is the main processing option for the site generator tool.

The file or directory name must follow the input option.

In the case of spaces in file or directory names, quotation marks "" are needed to wrap around the name.

----
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

----
## Generated Pages live example
[Link to the example webpage](https://rclee91.github.io/SiteGen/)




