#!/usr/bin/env node
const program = require('../lib/command');

program.parseAsync(process.argv)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });