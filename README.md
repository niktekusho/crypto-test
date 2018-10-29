# Example using the Crypto module to encrypt and decrypt files

The example goes through the following steps:
1. `require` all the necessary modules:
   -  `crypto`, the test subject;
   -  `fs`, read and write simple text files;
   -  `path`, resolve file paths;
   -  `assert`, test the result of the operations;
2. setup some utility objects and the cryptography-related functions;
3. define a key that goes through SHA256 (AES-256 requires 256 bits of key (32 Bytes));
4. generate a random initialization vector (16 Bytes);
5. read the [`test.txt`](./test.txt) _synchronously_ (utf8 encoding);
6. encrypt the content with the already setup stuff and store it into a file. The content is a hex encoded string that is written to the file using the utf8 encoding;
7. read the encrypted file and decrypt it with the same key and iv;
8. simple test using Node's integrated assert function.

# ⚠️ WARNING! ⚠️ This repository contains code NOT DESIGNED to be used in production systems.

If you're still unconvinced... Just some heads up:
 - [x] "Secret" key used in the application is not loaded via secure methods (environment vars?)
 - [x] Files are read and written using Node.js **synchronous** APIs...
 - [x] File contents are kept in memory the whole time (no streams)
 - [x] Code has bad structure. ☠️ **Read as**: "An whole world inside your index.js file"
 - [x] No code quality tools installed 💩💩💩
