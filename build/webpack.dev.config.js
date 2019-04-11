const path = require('path')
const webpackMerge = require('webpack-merge')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 将 HtmlWebpackPlugin 生成的 ejs 文件打包到硬盘，其他资源文件留在缓存里访问
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin')
const glob = require('glob')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = webpackMerge(webpackBaseConfig, {
	output: {
		path: path.resolve(__dirname, '../devDist')
	},

	module: {
		rules: [
			{
				test: /\.less|\.css$/,
				use: ExtractTextWebpackPlugin.extract({
					fallback: {
						loader: 'style-loader',
						options: {
							singleton: true
						}
					},
					use: [
						'css-loader?minimize=true',
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: [
									require('postcss-cssnext')()
								]
							}
						},
						'px2rem-loader?remUnit=192',
						'less-loader'
					]
				})
			}
		]
	},

	plugins: [
		new ExtractTextWebpackPlugin({
			filename: 'css/[name].min.css'
		}),

		/**
		 * 打包文件入口
		 */
		...glob.sync(path.resolve(__dirname, '../src/tpls/*.html')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			const filename = `views/${tempList[tempList.length - 1].replace(/\.html/g, '.ejs')}`
			const template = filepath
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
			const chunks = ['manifest', 'vendors', fileChunk]
			return new HtmlWebpackPlugin({ filename, template, chunks, alwaysWriteToDisk: true })
		}),

		/**
		 * 打包 ejs includes 公共文件
		 */
		...glob.sync(path.resolve(__dirname, '../src/tpls/includes/*.html')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			const filename = `views/includes/${tempList[tempList.length - 1].replace(/\.html/g, '.ejs')}`
			const template = filepath
			return new HtmlWebpackPlugin({ filename, template, inject: false, alwaysWriteToDisk: true })
		}),

		new HtmlWebpackHardDiskPlugin()
	],

	devtool: 'source-map',

	mode: 'development'
})
