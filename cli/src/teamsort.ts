#!/usr/bin/env node

import { Elm } from '../build/Main.js';
import * as readline from 'readline';
import * as fs from 'fs';
import minizinc from './minizinc';

const fsPromise = fs.promises;

const program = Elm.Main.init({
    flags: { argv: process.argv, versionMessage: '0.0.1' },
});

program.ports.print.subscribe((message) => {
    console.log(message);
});

program.ports.printAndExitFailure.subscribe((message) => {
    console.log(message);
    process.exit(1);
});

program.ports.printAndExitSuccess.subscribe((message) => {
    console.log(message);
    process.exit(0);
});

program.ports.writeFile.subscribe(writeFile);

program.ports.readFile.subscribe((content) => readFile(program, content));

function writeFile(file, content) {
    return fsPromise
        .writeFile(file[0], file[1])
        .catch((err) => console.log(err));
}

function readFile(program, file) {
    return fsPromise
        .readFile(file)
        .then((content) => {
            program.ports.fileReceive.send(content.toString('utf-8'));
        })
        .catch((err) => console.log(err));
}