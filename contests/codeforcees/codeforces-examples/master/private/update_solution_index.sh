set -x
for p in $(find -maxdepth 1 -type d | grep -vE '^\.$' | grep -E '^\./[[:digit:]]{3}[A-Z](-[cjp]+)?$'); do
    suffix=""
    if [ -d $p/c ]; then
	suffix=$suffix'c'
    fi
    if [ -d $p/python ]; then
	suffix=$suffix'p'
    fi
    if [ -d $p/java ]; then
	suffix=$suffix'j'
    fi
    problem=${p%%-*}
    target=$problem-$suffix
    if [ "$p" != "$target" ]; then
	mv $p/* $target
    fi
done
