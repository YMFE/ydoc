#!/bin/sh

# 构建 ydoc 的页面
bin/ydoc build

# 构建 demo 的页面们
cd docs/demo && ../../bin/ydoc build

# 新建目录
mkdir ../../doc/demo/examples
mkdir ../../doc/demo/examples/extension
mkdir ../../doc/demo/examples/hello-world
mkdir ../../doc/demo/examples/homepage
mkdir ../../doc/demo/examples/multifiles
mkdir ../../doc/demo/examples/page
mkdir ../../doc/demo/examples/sidenav

# 构建子页面
cd examples/extension && ../../../../bin/ydoc build
cd ../hello-world && ../../../../bin/ydoc build
cd ../homepage && ../../../../bin/ydoc build
cd ../multifiles && ../../../../bin/ydoc build
cd ../page && ../../../../bin/ydoc build
cd ../sidenav && ../../../../bin/ydoc build
