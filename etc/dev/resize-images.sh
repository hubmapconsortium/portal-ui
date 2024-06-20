#!/usr/bin/env bash

# First argument should be the directory of images to resize
cd $1

# Check if imagemagick is installed
if ! command -v convert &> /dev/null
then
    echo "imagemagick could not be found"
    echo "Install imagemagick with:"
    echo " - brew install imagemagick (macOS)" 
    echo " - sudo apt-get install imagemagick (Ubuntu)"
    exit
fi

# Loop through all files in the directory and resize to 75%, 50%, and 25%
for file in *
do
    convert $file -resize 75% "${file%.*}-75.png"
    convert $file -resize 50% "${file%.*}-50.png"
    convert $file -resize 25% "${file%.*}-25.png"
    mv $file "${file%.*}-100.png"
done