import * as fs from 'fs';
import path from 'path';
import readline from 'readline';
import { access, constants } from 'node:fs';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define a basic MDX template
const mdxTemplate = `---
title: "New MDX Page"
date: "${new Date().toISOString()}"
---

# New MDX Page

Welcome to your new MDX page. Start editing to add your content!
`;

// Function to ensure the filename ends with .mdx
const ensureMdxExtension = (filename:string) => {
  return filename.endsWith('.mdx') ? filename : `${filename}.mdx`;
};

// Function to check file existence and prompt for new name
const checkFileAndCreate = (directory:string, filename:string) => {
  const fullPath = path.join(directory, ensureMdxExtension(filename));
  access(fullPath, constants.F_OK, (err) => {
    if (err) {
      createFile(directory, filename);
    } else {
      console.log(`A file with the same name already exists at ${fullPath}`);
      rl.question('Please enter a new filename: ', (newFilename) => {
        checkFileAndCreate(directory, newFilename); // Recursively check the new name
      });
    }
  }

  )

}

// Function to create the file
const createFile = (directory, filename) => {
  const fullPath = path.join(directory, ensureMdxExtension(filename));
  fs.writeFile(fullPath, mdxTemplate, err => {
    rl.close(); // Ensure the readline interface is closed
    if (err) {
      console.error('Error creating MDX file:', err);
      process.exit(1); // Exit with an error code
    }
    console.log(`MDX file created successfully at ${fullPath}`);
    process.exit(0); // Clean exit
  });
};

// Get directory and initial filename from command line arguments
const directory = process.argv[2];
let filename = process.argv[3];

// Check and adjust the filename to include the .mdx extension
filename = ensureMdxExtension(filename);

// Ensure the directory exists
fs.mkdir(directory, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating directory:', err);
    rl.close(); // Make sure to close readline if directory creation fails
    process.exit(1); // Exit with an error code
  }
  checkFileAndCreate(directory, filename);
});
