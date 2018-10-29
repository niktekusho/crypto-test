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
		cipher.update(data),
		cipher.final()
	]);

	return encrypted.toString(config.intermediateEncoding);
}

const key = 'secret';
const keyHash = utils.createHash(key);
console.log(`key hash: ${keyHash.toString(config.intermediateEncoding)}`);

const iv = crypto.randomBytes(16);
console.log(`iv: ${iv.toString(config.intermediateEncoding)}`);

const file = 'test.txt';
const originalFile = fs.readFileSync(file, {encoding: 'utf8'});
console.log(`data: ${originalFile}`);

const encrypted = encrypt(originalFile, keyHash, iv);
console.log(`Encrypted to hex: ${encrypted}`);
const encryptedFile = utils.getEncryptedFileName(file)
fs.writeFileSync(encryptedFile, encrypted);

const encryptedFromFile = fs.readFileSync(encryptedFile, {encoding: 'utf8'});
const decrypted = decrypt(encryptedFromFile, keyHash, iv);
console.log(`Decrypted: ${decrypted}`);

assert(originalFile === decrypted);
