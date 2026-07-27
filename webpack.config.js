const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: path.join(__dirname, 'src', 'client', 'main.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},

	module: {
		rules: [
			{
				test: /\.?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					//Presets now come from the shared 'babel.config.js' at the repo root (also used by Jest).
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				use: ['file-loader'],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'client', 'public', 'index.html'),
			favicon: path.join(__dirname, 'src', 'client', 'public', 'tetrimino.ico'),
		}),
	],

	devServer: {
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		hot: true,
	},
}
