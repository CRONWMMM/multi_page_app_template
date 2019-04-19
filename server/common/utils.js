const axios = require('axios')
const CONFIG = require('../../build/config')

function getTemplate (filename) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
			.then(res => {
				resolve(res.data)
			})
			.catch(reject)
	})
}

module.exports = {
	getTemplate
}
