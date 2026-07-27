//This file loads @testing-library/jest-dom matchers, polyfills TextEncoder/TextDecoder that jsdom doesn't provide
//This is necessary for Jest to test the client / frontend

//The jsdom test environment (needed to render client components) doesn't expose these Node globals that
//the server-side test dependencies (supertest -> superagent -> formidable -> cuid2) rely on.
const { TextEncoder, TextDecoder } = require('node:util')
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = TextDecoder
}

require('@testing-library/jest-dom')
