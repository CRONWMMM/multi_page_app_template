const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')
const { resolve } = require('path')
const CONFIG = require('./config')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
	entry: ((filepathList) => {
		let entry = {}
		filepathList.forEach(filepath => {
			const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			const key = list[list.length - 1].replace(/\.js/g, '')
			// 如果是开发环境，才需要引入 hot module
			entry[key] = isDev ? [filepath, 'webpack-hot-middleware/client?reload=true'] : filepath
		})
		return entry
	})(glob.sync(resolve(__dirname, '../src/js/*.js'))),

	output: {
		path: resolve(__dirname, `../${CONFIG.DIR.DIST}`),
		publicPath: CONFIG.PATH.PUBLIC_PATH,
		filename: `${CONFIG.DIR.SCRIPT}/[name].bundle.js`,
		chunkFilename: `${CONFIG.DIR.SCRIPT}/[name].[chunkhash].js`
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, '../src'),
			js: resolve(__dirname, '../src/js'),
			css: resolve(__dirname, '../src/css'),
			less: resolve(__dirname, '../src/less')
		}
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /(node_modules|lib|libs)/
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[hash:5].[ext]',
							limit: 1000,
							outputPath: CONFIG.DIR.IMAGE
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							disable: process.env.NODE_ENV !== 'production',
							pngquant: {
								quality: '80'
							}
						}
					}
				]
			},
			{
				test: /\.(eot|woff2|woff|ttf|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: CONFIG.DIR.FONT
						}
					},
					{
						loader: 'url-loader'
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							attrs: ['img:src', 'img:data-src', ':data-background']
						}
					}
				]
			},
			{
				test: /\.ejs$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							attrs: ['img:src', 'img:data-src', ':data-background']
						}
					},
					{
						loader: 'ejs-html-loader',
						options: {
							production: process.env.ENV === 'production'
						}
					}
				]
			}
		]
	},

	plugins: [
		new CopyWebpackPlugin([
			{
				from: resolve(__dirname, '../src/css/lib'),
				to: resolve(__dirname, `../${CONFIG.DIR.DIST}/${CONFIG.DIR.STYLE}`),
				writeToDisk: !isDev
			}
		]),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		// 打包文件
		...glob.sync(resolve(__dirname, '../src/views/*.ejs')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			// 读取 CONFIG.EXT 文件自定义的文件后缀名，默认生成 ejs 文件，可以定义生成 html 文件
			const filename = (name => `${name.split('.')[0]}.${CONFIG.EXT}`)(`${CONFIG.DIR.VIEW}/${tempList[tempList.length - 1]}`)
			const template = filepath
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
			const chunks = isDev ? [ fileChunk ] : ['manifest', 'vendors', fileChunk]
			return new HtmlWebpackPlugin({ filename, template, chunks })
		})
	]
}
