#!/bin/bash

# Directory where the MDX file will be created
DIRECTORY="./content"

# MDX file name, default to newFile.mdx if not provided
FILENAME="${2:-newFile.mdx}"

# Check if directory exists, if not create it
if [ ! -d "$DIRECTORY" ]; then
  mkdir -p "$DIRECTORY"
fi

# Run Node.js script to create an MDX file
node createMdx.js "$DIRECTORY" "$FILENAME"
