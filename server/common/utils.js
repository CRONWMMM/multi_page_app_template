const axios = require('axios')
const fs = require('fs')
const path = require('path')

function getTemplate (filename) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:8088/public/${filename}`)
			.then(res => {
				resolve(res.data)
			})
			.catch(reject)
	})
}

module.exports = {
	getTemplate
}
