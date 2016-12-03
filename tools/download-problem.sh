#!/bin/bash

set -x

if [ "$#" -lt "1" ]; then
    echo "usage: $0 <problem-code> ..." >&2
    echo "e.g.: $0 460A 460B 460E" >&2
    exit 1
fi

for prob in $@; do
    p_num=${prob:0:3}
    p_let=${prob:3:1}
    dir=./problems
    dl_dir=$dir/$prob
    index=$dl_dir/_$prob.html
    pdf=$dir/$prob.pdf
    pkg=$dir/$prob.html.tar.gz
    curd=$(pwd)

    if [ ! -e $index ] && [ ! -e $pdf ] && [ ! -e $pkg ]; then
        mkdir -p $dir
        echo "$" wget http://codeforces.com/problemset/problem/$p_num/$p_let "..."
        wget http://codeforces.com/problemset/problem/$p_num/$p_let \
            -kp -H -nd -e robots=off -np -A jpg,jpeg,png,svg,gif,css,$p_let -P $dl_dir -q
        mv $dl_dir/$p_let $index
        echo "created:"
        echo "  file://$curd/$index"
        echo
        echo "$" du -sh $dl_dir
        du -sh $dl_dir
    elif [ -e $index ]; then
        echo "existing:"
        echo "  file://$curd/$index"
    fi

    which wkhtmltopdf &>/dev/null
    ret=$?
    if [ $ret -eq 0 ] && [ -e $index ] && [ ! -e $pdf ]; then
        echo "$" wkhtmltopdf --allow $dir $index $pdf
        wkhtmltopdf -q --allow $dir $index $pdf 
        if [ $? -eq 0 ]; then
            echo
            echo "  file://$curd/$pdf"
            echo "  $pdf"
            echo
        else
            echo "Error creating pdf" >&2
        fi
    elif [ $ret -gt 0 ]; then
        echo "Install wkhtmltopdf to crate PDF"
        echo "  sudo apt-get install wkhtmltopdf"
        echo ""
        echo "  [ -f /usr/lib/libGL.so.1 ] || sudo" \
            "ln -s /usr/lib/x86_64-linux-gnu/mesa/libGL.so.1 /usr/lib/libGL.so.1 "
    fi

    if [ -e $index ] && [ -e $pdf ]; then
        echo "$" tar czf $pkg $dl_dir
        tar czf $pkg $dl_dir \
            && rm -rf $dl_dir
        echo "  $pkg"
        echo
    fi
done
