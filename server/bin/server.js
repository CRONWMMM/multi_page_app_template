const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const { routerFactory } = require('../routes')
let app = express()
let webpackConfig = require('../../build/webpack.dev.config')
let compiler = webpack(webpackConfig)
let port = 8088

;(async app => {
	// 用 webpack-dev-middleware
	app.use(webpackMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		overlay: true
	}))

	app.use(webpackConfig.output.publicPath, express.static(path.resolve(__dirname, '../../src')))

	// 构造路由
	routerFactory(app)
})(app)

app.listen(port, () => console.log(`development is listening on port ${port}`))
