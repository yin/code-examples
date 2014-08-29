#!/bin/bash

if [ "$#" -lt "2" ]; then
    echo "usage: $0 <contest> <problem>" >&2
    echo "e.g.: $0 460 D" >&2
    exit 1
fi

dir=problems/$1$2
index=$dir/_$1$2.html
curd=$(pwd)

if [ ! -e $index ]; then
    mkdir -p $dir
    wget http://codeforces.com/problemset/problem/$1/$2 -kp -H -nd -e robots=off -np -A jpg,jpeg,png,svg,gif,css, -P $dir >&2
    mv $dir/$2 $index
fi

echo
echo "  file://$curd/$index"
echo
