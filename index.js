const example1 = require('./example1');
const example2 = require('./example2');

const modules = [
	example1,
	example2,
];

modules.forEach(example => example());
