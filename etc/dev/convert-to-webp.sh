#!/usr/bin/env bash

# First argument should be the directory of images to convert
cd $1

# Check if webp library is installed
if ! command -v cwebp &> /dev/null
then
    echo "cwebp could not be found"
    echo "Install webp library with:"
    echo " - brew install webp (macOS)" 
    echo " - sudo apt-get install webp (Ubuntu)"
    exit
fi

# Loop through all files in the directory and convert to webp
for file in *
do
    cwebp -q 80 $file -o "${file%.*}.webp"
done