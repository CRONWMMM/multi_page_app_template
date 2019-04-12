const path = require('path')
const webpackMerge = require('webpack-merge')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
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
				use: ExtractTextWebpackPlugin.extract({
					fallback: {
						loader: 'style-loader',
						options: {
							singleton: true
						}
					},
					use: [
						'css-loader',
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
			filename: `${CONFIG.DIR.STYLE}/[name].min.css`
		}),

		new OptimizeCss(),

		// css tree-shaking ( css tree-shaking 会移除没有使用到的 css 样式，如果有按时机使用样式类的情况，不推荐用 tree-shaking )
		/*
		new PurifyCss({
			paths: globAll.sync([
				path.join(__dirname, '../src/tpls/*.html'),
				path.join(__dirname, '../src/js/*.js')
			])
		}),
		*/

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

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					minChunks: 1,
					chunks: 'all',
					priority: 100
				},
				common: {
					test: /[\\/]server[\\/]src[\\/]js[\\/]/,
					name: 'common',
					minChunks: 2,
					chunks: 'all',
					priority: 1
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},

	devtool: false,

	mode: 'production'
})
