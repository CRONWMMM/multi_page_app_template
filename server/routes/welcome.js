const ejs = require('ejs')
const { getTemplate } = require('../common/utils')

const welcomeRoute = function (app) {
	app.get('/welcome', async (req, res, next) => {
		try {
			const template = await getTemplate('welcome.ejs')
			let html = ejs.render(template, { title: '欢迎' })
			res.send(html)
		} catch (e) {
			next(e)
		}
	})
}

module.exports = welcomeRoute
