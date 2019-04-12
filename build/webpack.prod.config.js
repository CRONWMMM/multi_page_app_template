const path = require('path')
const webpackMerge = require('webpack-merge')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
			filename: 'css/[name].[hash].css'
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

		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../src/tpls/index.ejs'),
			filename: 'index.ejs'
		})

		/*
		new HtmlWebpackPlugin({
			filename: 'views/index.ejs',
			template: path.resolve(__dirname, '../src/tpls/index.html'),
			chunks: ['index', 'manifest', 'vendors']
		})
		*/
	],

	optimization: {
		// minimize: false,
		// minimizer: [
		// new UglifyJs({
		// 		uglifyOptions: {
		// 			ecma: 6,
		// 			cache: true,
		// 			parallel: true
		// 		}
		// 	})
		// ],
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
