[![Build Status](https://travis-ci.org/niktekusho/crypto-test.svg?branch=master)](https://travis-ci.org/niktekusho/crypto-test)

# Examples using the Crypto module to encrypt and decrypt files

## [Example #1: Runtime genrated IV (not persisted)](./example1/README.md)

## [Example #2: First-time generated IV then file-persisted use](./example2/README.md)


# ⚠️ WARNING! ⚠️ This repository contains code NOT DESIGNED to be used in production systems.

If you're still unconvinced... Just some heads up:
 - [x] "Secret" key used in the application is not loaded via secure methods (environment vars?)
 - [x] Files are read and written using Node.js **synchronous** APIs...
 - [x] File contents are kept in memory the whole time (no streams)
 - [x] Code has bad structure. ☠️ **Read as**: "An whole world inside your index.js file"
 - [x] No code quality tools installed 💩💩💩
