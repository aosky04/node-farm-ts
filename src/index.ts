// Import the fs core module
import fs from 'node:fs';

// Declare a variable
const helloMessage = 'Hello world!';

// Print out a variable
console.log(helloMessage);

// Read a file synchronously, Blocking way
const textInput = fs.readFileSync(`${__dirname}/txt/input.txt`, 'utf-8');
console.log(textInput);

// Read a file synchronously, Blocking way
const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;
fs.writeFileSync(`${__dirname}/txt/output.txt`, textOutput);

// Read a file asynchronously, Non-blocking way
fs.readFile(`${__dirname}/txt/start.txt`, 'utf-8', (err, data1) => {
  // Handle an error that might occur while reading a file
  if (err) return console.log('ERROR! 💥');

  fs.readFile(`${__dirname}/txt/${data1}.txt`, 'utf-8', (_err, data2) => {
    console.log(data2);

    fs.readFile(`${__dirname}/txt/append.txt`, 'utf-8', (_err, data3) => {
      console.log(data3);

      // Write a file asynchronously, Non-blocking way
      fs.writeFile(
        `${__dirname}/txt/final.txt`,
        `${data2}\n${data3}`,
        'utf-8',
        () => {
          console.log('Your file has beed written 🏁');
        }
      );
    });
  });
});

// Print something
console.log('Will read the file!');
