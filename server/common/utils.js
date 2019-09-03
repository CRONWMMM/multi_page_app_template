const axios = require('axios')
const ejs = require('ejs')
const CONFIG = require('../../build/config')
const isDev = process.env.NODE_ENV === 'development'

function getTemplateString (filename) {
	return new Promise((resolve, reject) => {
		axios.get(`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`)
			.then(res => {
				resolve(res.data)
			})
			.catch(reject)
	})
}

/**
 * render 方法
 * @param res express 的 res 对象
 * @param filename 需要渲染的文件名
 * @param data ejs 渲染时需要用到的附加对象
 * @returns {Promise<*|undefined>}
 */
async function render (res, filename, data) {
	// 文件后缀
	const ext = '.ejs'
	filename = filename.indexOf(ext) > -1 ? filename.split(ext)[0] : filename
	try {
		if (isDev) {
			const template = await getTemplateString(`${filename}.ejs`)
			let html = ejs.render(template, data)
			res.send(html)
		} else {
			res.render(filename, data)
		}
		return Promise.resolve()
	} catch (e) {
		return Promise.reject(e)
	}
}

module.exports = {
	getTemplateString,
	render
}
