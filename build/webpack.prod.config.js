const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
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
						{
							loader: 'css-loader',
							options: {
								importLoaders: 2
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								plugins: [
									require('postcss-cssnext')()
								]
							}
						},
						'less-loader'
					]
				})
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),

		new ExtractTextWebpackPlugin({
			filename: `${CONFIG.DIR.STYLE}/[name].min.css`
		}),

		new OptimizeCss()
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

	devtool: 'cheap-module-source-map',

	mode: 'production'
})
