const fs = require('fs');
const path = require( 'path' );
const process = require('process');


// Get directory and filename from the command line arguments
const directory = process.argv[2];
const filename = process.argv[3];

// Construct the full path for the new MDX file
const fullPath = path.join(directory, filename);

// Write an empty MDX file
fs.writeFile(fullPath, "", (err) => {
  if (err) {
    console.error("Error creating MDX file:", err);
  } else {
    console.log(`MDX file created successfully at ${fullPath}`);
  }
});
