/**
 * @jest-environment jsdom
 */

//This file allows to test frontend/client/component-rendering by running its code in a simulated DOM. 

//The docblock above tells Jest to run only THIS file in the 'jsdom' environment (fake browser DOM),
//which '@testing-library/react' needs to render components into. 'integration.test.js' cannot use
//jsdom itself: it 'require's the real server ('app.js'), and the real socket.io server mistakes
//jsdom's global 'WebSocket' for a server-side websocket engine constructor and crashes on startup.
//Splitting client-rendering tests into their own file keeps both the real server (node environment)
//and real component rendering (jsdom environment) working.

const React = require('react')
const { render, screen, fireEvent, cleanup } = require('@testing-library/react')
require('@testing-library/jest-dom')

const RedButton = require('./RedButton').default
const YellowButton = require('./YellowButton').default
const SmallButton = require('./SmallButton').default
const RedTetrisLogo = require('./RedTetrisLogo').default
const RedTetrisTitle = require('./RedTetrisTitle').default

//Unmounts whatever was rendered by the previous test so components don't pile up in the DOM between tests.
afterEach(cleanup)

describe('Shared client components', () => {
	//Both 'RedButton' and 'YellowButton' share the same props/behavior (textContent, onClick, hover
	//swaps background color), so they're tested together via this table instead of duplicating the test twice.
	describe.each([
		['RedButton', RedButton],
		['YellowButton', YellowButton],
	])('%s', (name, Button) => {
		test('renders its textContent', () => {
			render(React.createElement(Button, { textContent: 'Play', onClick: () => {} }))
			expect(screen.getByText('Play')).toBeInTheDocument()
		})

		test('calls onClick when clicked', () => {
			const onClick = jest.fn() //Jest's mock function: records how many times it was called and with what arguments.
			render(React.createElement(Button, { textContent: 'Play', onClick }))
			fireEvent.click(screen.getByText('Play'))
			expect(onClick).toHaveBeenCalledTimes(1)
		})
	})

	test('SmallButton renders its textContent and calls onClick when clicked', () => {
		const onClick = jest.fn()
		render(React.createElement(SmallButton, { textContent: 'Ready', onClick }))
		const button = screen.getByText('Ready')
		expect(button).toBeInTheDocument()
		fireEvent.click(button)
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	test('RedTetrisLogo renders both of its lines', () => {
		render(
			React.createElement(RedTetrisLogo, {
				firstLine: 'Red',
				secondLine: 'Tetris',
			})
		)
		expect(screen.getByText('Red')).toBeInTheDocument()
		expect(screen.getByText('Tetris')).toBeInTheDocument()
	})

	test('RedTetrisTitle renders the fixed "Red" and "Tetris" title', () => {
		render(React.createElement(RedTetrisTitle))
		expect(screen.getByText('Red')).toBeInTheDocument()
		expect(screen.getByText('Tetris')).toBeInTheDocument()
	})
})
