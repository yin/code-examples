to=../contests
set -x
for f in `find -maxdepth 1 -type f -name '*.pdf'`; do
    p=${f:2:4}
    target=$to/$p
    if [ -e $target* ]; then
	target=$target*
    fi
    mkdir -p $target
    mv $f $target
done
