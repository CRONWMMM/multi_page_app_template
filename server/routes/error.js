const express = require('express')
const router = express.Router()
const { render } = require('../common/utils')

router.get('/404', async (req, res, next) => {
	try {
		await render(res, '404', { title: '页面走丢了' })
	} catch (e) {
		next(e)
	}
})

module.exports = router
