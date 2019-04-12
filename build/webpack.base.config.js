const Webpack = require('Webpack')
const glob = require('glob')
const { resolve } = require('path')

const entry = ((filepathList) => {
	let entry = {}
	filepathList.forEach(filepath => {
		const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
		const key = list[list.length - 1].replace(/\.js/g, '')
		entry[key] = filepath
	})
	return entry
})(glob.sync(resolve(__dirname, '../src/js/*.js')))

module.exports = {
	entry,

    output: {
        path: resolve(__dirname, '../dist'),
        publicPath: '/public',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].chunk.js'
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
							limit: 10000,
							outputPath: 'imgs/'
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
							outputPath: 'fonts/'
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
						loader: 'ejs-webpack-loader',
						options: {
							htmlmin: process.env.NODE_ENV === 'production'
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
