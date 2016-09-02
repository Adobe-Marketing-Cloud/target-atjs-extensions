#!/bin/bash
cd "${0%/*}"
git add . && git stash
git checkout master
git pull
tmpdir=`mktemp -d`
cp -r demos/* $tmpdir/
git checkout gh-pages
git pull
cp -r $tmpdir/* .
git add .
git commit -m "Update Github Pages with latest demos"
git push -u origin gh-pages
git checkout master
git stash pop
rm -rf $tmpdir
