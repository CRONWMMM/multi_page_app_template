const ejs = require('ejs')
const { getTemplate } = require('../common/utils')

const homeRoute = function (app) {
	app.get('/', async (req, res) => {
		try {
			const template = await getTemplate('index.ejs')
			let html = ejs.render(template, { title: '首页' })
			res.send(html)
		} catch (e) {
			console.log(e)
			res.status(500)
			res.send('服务器内部错误')
		}
	})
	app.get('/home', async (req, res) => {
		try {
			const template = await getTemplate('index.ejs')
			let html = ejs.render(template, { title: '首页' })
			res.send(html)
		} catch (e) {
			console.log(e)
			res.status(500)
			res.send('服务器内部错误')
		}
	})
}

module.exports = homeRoute
