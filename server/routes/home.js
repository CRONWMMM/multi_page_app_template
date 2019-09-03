const express = require('express')
const router = express.Router()
const { render } = require('../common/utils')

router.get('/', async (req, res, next) => {
	try {
		await render(res, 'home', { title: '首页' })
	} catch (e) {
		next(e)
	}
})

router.get('/home', async (req, res, next) => {
	try {
		await render(res, 'home', { title: '首页' })
	} catch (e) {
		next(e)
	}
})

module.exports = router
