const path = require('path')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const homeRouter = require('./routes/home')
const welcomeRouter = require('./routes/welcome')
const errorRouter = require('./routes/error')

const CONFIG = require('../build/config')
const isDev = process.env.NODE_ENV === 'development'
const app = express()

let webpackConfig = require('../build/webpack.dev.config')
let compiler = webpack(webpackConfig)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

if (isDev) {
	// 用 webpack-dev-middleware 启动 webpack 编译
	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}))

	// 使用 webpack-hot-middleware 支持热更新
	app.use(webpackHotMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		noInfo: true
	}))

	// 指定开发环境下的静态资源目录
	app.use(webpackConfig.output.publicPath, express.static(path.join(__dirname, '../src')))
} else {
	app.set('views', path.join(__dirname, `../${CONFIG.DIR.DIST}`))
	app.set('view engine', 'ejs')
	app.use(express.static(path.join(__dirname, `../${CONFIG.DIR.DIST}`)))
}

// 注意这边写了父级目录，在对应的 router 里就不要再写了，直接写根路由就可以，否则 404
app.use('/', homeRouter)
app.use('/welcome', welcomeRouter)
app.use('/error', errorRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.redirect('/error/404')
})

// 错误处理
// 这边需要注意的是一定要写四个形参，否则 express 不会认为是一个错误处理函数
app.use((err, req, res, next) => {
	res.status(err.status || 500)
	res.send(err.stack || 'Service Error')
	/*
    res.render('error', {
        message: err.message,
        error: err
    })
    */
})

module.exports = app
