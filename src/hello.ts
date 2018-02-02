class HelloWorld {
  constructor(public displayText: string) { }

  greet() {
    return this.displayText;
  }
}

const helloWorld = new HelloWorld('HelloWorld');

console.log(helloWorld.greet());
