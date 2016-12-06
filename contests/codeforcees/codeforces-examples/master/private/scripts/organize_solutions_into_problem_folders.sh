#!/bin/bash

# One time script used to move my solutions into the private/ folder from
# the old structure.

to=../contests
lang=python
set -x
for src in `find -maxdepth 1 -type d | grep -vE '^\.$'`; do
    problem=${src%%_TODO}
    target=$to/$problem/$lang
    if [ "$src" != "$problem" ]; then
	target=$target"_todo"
    fi
    mkdir -p $target
    mv $src/* $target
    rm -d $src
done
