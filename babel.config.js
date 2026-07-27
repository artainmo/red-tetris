//This file is a shared Babel config for both webpack and Jest (webpack now points here instead of inline options)
//This is necessary for Jest to test the client / frontend

module.exports = {
	presets: ['@babel/preset-env', '@babel/preset-react'],
}
