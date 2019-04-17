const Webpack = require('Webpack')
const glob = require('glob')
const { resolve } = require('path')
const CONFIG = require('./config')

const entry = ((filepathList) => {
	let entry = {}
	filepathList.forEach(filepath => {
		const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
		const key = list[list.length - 1].replace(/\.js/g, '')
		// 如果是开发环境，才需要引入 hot module
		entry[key] = process.env.NODE_ENV === 'development' ? [filepath, 'webpack-hot-middleware/client'] : filepath
	})
	return entry
})(glob.sync(resolve(__dirname, '../src/js/*.js')))

module.exports = {
	entry,

    output: {
        path: resolve(__dirname, `../${CONFIG.DIR.DIST}`),
        publicPath: `/${CONFIG.PATH.PUBLIC_PATH}`,
        filename: `${CONFIG.DIR.SCRIPT}/[name].bundle.js`,
        chunkFilename: `${CONFIG.DIR.SCRIPT}/[name].chunk.js`
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
				// include: []
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[hash:5].[ext]',
							limit: 1000,
							outputPath: `${CONFIG.DIR.IMAGE}/`
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							disable: process.env.NODE_ENV !== 'production',
							pngquant: {
								quality: '10'
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
							outputPath: `${CONFIG.DIR.FONT}/`
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
		new Webpack.ProvidePlugin({
			$: 'jquery'
		})
	]
}
