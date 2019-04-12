const path = require('path')
const webpackMerge = require('webpack-merge')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 将 HtmlWebpackPlugin 生成的 ejs 文件打包到硬盘，其他资源文件留在缓存里访问
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin')
const glob = require('glob')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = webpackMerge(webpackBaseConfig, {
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

		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/tpls/index.ejs'),
			filename: 'index.ejs'
		})
	],

	devtool: 'source-map',

	mode: 'development'
})
