import HackAssembler from './assembler'

(async () => {
  const assembler = new HackAssembler()
  await assembler.setup()
  await assembler.exec()
})()
