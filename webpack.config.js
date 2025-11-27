const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 	entry: path.join(__dirname, "src", "client", "main.js"),
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
          			loader: "babel-loader",
					      options: {
            			presets: ['@babel/preset-env', '@babel/preset-react']
          			}
        		}
      		},
			{
        		test: /\.css$/i,
        		use: ["style-loader", "css-loader"],
      },
			{
        		test: /\.(png|jp(e*)g|svg|gif)$/,
        		use: ['file-loader'],
      		}
    	]
//		loaders: [{
//      		test: /\.js$/,
//      		exclude: /node_modules/,
//      		loader: 'babel',
//      		query:{
//        		presets: ["es2015", "react", "stage-0"]
//      		}
//    	}]
  	},

	plugins: [
    	new HtmlWebpackPlugin({
      		template: path.join(__dirname, "src", "client", "public", "index.html"),
            favicon: path.join(__dirname, "src", "client", "public", "tetrimino.ico")
    	}),
	],

	/* add this when reloading page to serve html file everytime so react router can works properly */
	devServer: {
		historyApiFallback: true,
		static: {
		  directory: path.join(__dirname, 'dist'),
		},
		hot: true,
		// If you need to define a base path for all the assets served by Webpack Dev Server, use the static.publicPath option:
		// static: {
		//   directory: path.join(__dirname, 'dist'),
		//   publicPath: '/',
		// },
		// Remove the publicPath line from here
	},
};
