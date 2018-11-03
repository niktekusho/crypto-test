const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const config = {
	encryptionAlgorithm: 'aes-256-cbc',
	keyHashAlgorithm: 'sha256',
	intermediateEncoding: 'hex'
};

const utils = {
	createHash(key) {
		return crypto.createHash(config.keyHashAlgorithm).update(key).digest();
	},
	getEncryptedFileName(file) {
		const encryptedFileSuffix = '.encrypted.txt';
		const filePath = path.resolve(__dirname, file);
		const dirName = path.dirname(filePath);
		const fileExt = path.extname(file);
		const fileName = path.basename(file, fileExt);
		const newFileName = fileName + encryptedFileSuffix;
		return path.resolve(dirName, newFileName);
	}
};

/**
 *
 * @param {string} data String to decrypt
 * @param {Buffer} key Block key - 32 Bytes long Buffer
 * @param {Buffer} iv Initialization Value - 16 Bytes long Buffer
 * @returns {string} Utf8 decoded string
 */
function decrypt(data, key, iv) {
	const decipher = crypto.createDecipheriv(config.encryptionAlgorithm, key, iv);
	const decrypted = Buffer.concat([
		decipher.update(data, config.intermediateEncoding),
		decipher.final()
	]);
	return decrypted.toString('utf8');
}

/**
 *
 * @param {string} data String to encrypt
 * @param {Buffer} key Block key - 32 Bytes long Buffer
 * @param {Buffer} iv Initialization Value - 16 Bytes long Buffer
 * @returns {string} Hex-encrypted string
 */
function encrypt(data, key, iv) {
	const cipher = crypto.createCipheriv(config.encryptionAlgorithm, key, iv);
	const encrypted = Buffer.concat([
		iv,
		cipher.update(data),
		cipher.final()
	]);

	return encrypted.toString(config.intermediateEncoding);
}

function generateEncryptedFile(key, plainTextFile, encryptedFile) {
	console.log('****************************************');
	console.log('');
	console.log('***************** Setup ****************');
	console.log('');

	if (fs.existsSync(encryptedFile)) {
		console.log('Encrypted file exists. Encrypted file generation skipped.');
	} else {
		const iv = crypto.randomBytes(16);
		console.log(`IV: ${iv.toString(config.intermediateEncoding)}`);

		const plainText = fs.readFileSync(plainTextFile, {encoding: 'utf8'});
		console.log(`Plain text: ${plainText}`);

		const encrypted = encrypt(plainText, key, iv);
		console.log(`Encrypted: ${encrypted}`);

		// First 16 bytes are the IV (it is save in plain text)
		const writtenIv = Buffer.from(encrypted, config.intermediateEncoding).slice(0, 16);
		console.log(`Written IV: ${writtenIv.toString(config.intermediateEncoding)}`);

		const mismatchError = new Error('IVs mismatch. The generated IV should be persisted as it is at the beginning of file');
		assert(Buffer.compare(iv, writtenIv) === 0, mismatchError);

		fs.writeFileSync(encryptedFile, encrypted, {encoding: 'utf8'});
	}

	console.log('');
	console.log('************** Setup: END **************');
	console.log('');
	console.log('****************************************');
}

function main() {
	const key = 'secret';
	const keyHash = utils.createHash(key);
	console.log(`key hash: ${keyHash.toString(config.intermediateEncoding)}`);

	const plainTextFile = path.resolve(__dirname, 'test.txt');
	const encryptedFile = path.resolve(__dirname, 'encrypted.test.txt');

	generateEncryptedFile(keyHash, plainTextFile, encryptedFile);

	console.log('');
	console.log('************** Actual test *************');
	console.log('');

	const encrypted = fs.readFileSync(encryptedFile, {encoding: 'utf8'});
	const iv = Buffer.from(encrypted, config.intermediateEncoding).slice(0, 16);
	console.log(`IV (from encrypted file): ${iv.toString(config.intermediateEncoding)}`);

	const encryptedData = Buffer.from(encrypted, config.intermediateEncoding).slice(16).toString(config.intermediateEncoding);
	const decrypted = decrypt(encryptedData, keyHash, iv);
	console.log(`Decrypted: ${decrypted}`);

	const plainText = fs.readFileSync(plainTextFile, {encoding: 'utf8'});
	assert(plainText.localeCompare(decrypted) === 0);
}


// Used when called directly, example: node example1/index.js
// If this module is called directly, run the main function
if (require.main === module) {
	main();
}

module.exports = main;
