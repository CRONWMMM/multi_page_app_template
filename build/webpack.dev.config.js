const path = require('path')
const Webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')
const CONFIG = require('./config')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = webpackMerge(webpackBaseConfig, {
	module: {
		rules: [
			{
				test: /\.less|\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			}
		]
	},

	plugins: [
		new ExtractTextWebpackPlugin({
			filename: `${CONFIG.DIR.STYLE}/[name].min.css`
		}),
		// OccurrenceOrderPlugin is needed for webpack 1.x only
		new Webpack.optimize.OccurrenceOrderPlugin(),
		new Webpack.HotModuleReplacementPlugin(),
		// Use NoErrorsPlugin for webpack 1.x
		new Webpack.NoEmitOnErrorsPlugin(),

		// 打包文件
		...glob.sync(path.resolve(__dirname, '../src/tpls/*.ejs')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			const filename = `${CONFIG.DIR.VIEW}/${tempList[tempList.length - 1]}`
			const template = filepath
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
			const chunks = ['manifest', 'vendors', fileChunk]
			return new HtmlWebpackPlugin({ filename, template, chunks })
		})
	],

	devtool: 'source-map',

	mode: 'development'
})
