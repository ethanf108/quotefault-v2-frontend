#!/bin/sh

commit=$(git rev-parse HEAD)
url=$(git remote -v | head -n 1 | sed -E -e 's/.+(git@|https:\/\/)//g' -e 's/(\.git)?\s\(\w+\)//g' -e 's/:/\//g')
file="src/pages/Home/GitFooter.tsx"

sed -i $(echo 's|%%%URL%%%|https://'$url'|g') $file

sed -i $(echo 's|%%%COMMIT%%%|'$commit'|g') $file

echo Updated git
