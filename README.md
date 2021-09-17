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
In terminal/console head to the main sitegen directory and call
`npm -install -g`


### version option example
`sitegen -v` or `sitegen --version` will display the tool name and current version.
```
  Name:  sitegen
  Version:  0.1.0
```


### help option example
`sitegen -h` or `sitegen --help` will list the tool options as listed above.


### input option examples
```
 sitegen -i filename
 sitegen --input "directory name"
```
This is the main processing option for the site generator tool.

The file or directory name must follow the input option.

In the case of spaces in file or directory names, quotation marks "" are needed to wrap around the name.






