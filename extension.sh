#!/bin/bash

#disabled webpack generating inline JavaScript in HTML.
#Normally webpack will put its own runtime into HTML inline script.
#But inline script is not allowed by browser extension.

build() {
    echo 'building react'

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    mkdir -p dist
    cp -r build/* dist
    cp src/background.js dist

    mv dist/index.html dist/popup.html
}

build