#!/bin/sh

echo "Removing all files from ../slapstuk/dist"
rm -r ../slapstuk/dist
echo "Copying files to ../slapstuk folder..."
cp -r ./dist  ../slapstuk
echo "Running 'firebase deploy --only hosting' from ../slapstuk folder..."
initialpath="$cd"
cd ../slapstuk
firebase deploy --only hosting
cd "$initialpath"
echo "Deploy to Slapstuk hosting done."