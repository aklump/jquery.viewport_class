#!/bin/bash
# 
# @file
# Copy distribution files to /dist
# 
sleep 2
test -d "$7/dist" || mkdir -p "$7/dist"
cp "$7/jquery.viewport_class.js" "$7/dist/"
cp "$7/jquery.viewport_class.min.js" "$7/dist/"
