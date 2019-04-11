const homeRoute = function (app) {
	app.get('/', (req, res) => {
		res.render('index.ejs', { title: '首页' })
	})
	app.get('/home', (req, res) => {
		res.render('index.ejs', { title: '首页' })
	})
}

module.exports = homeRoute
