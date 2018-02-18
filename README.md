## Hack Assembler
This is a ASM compiler made by Typescript for Hack language.

## How to compile
you have to put asm files into `root/asm` directory and click blow.
binary file will output `root/hack` and you can compare what you are given from subject assembler with this assembler.

```sh
$ yarn build && node ./dist/index.js filename.asm
$ diff hack/filename.hack testfile.hack
```

#### Read later
* http://co.bsnws.net/article/209
