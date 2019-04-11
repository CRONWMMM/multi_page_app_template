const fs = require('fs')
const path = require('path')

/**
 * 绝对路径生成
 * @param relatPath {String} 相对路径
 */
function pathResolve (relatPath) {
	return path.resolve(__dirname, relatPath)
}


/**
 * 获取文件后缀
 * @param filename    {String}  文件名
 * @param separator   {Boolean} 是否要分隔符，默认不需要
 * @returns {string}
 */
function getSuffix (filename='', separator=false) {
	let pos = filename.lastIndexOf('.')
	let suffix = ''
	if (pos != -1) {
		pos += 1
		// 截取后缀，并且去除非单词的后缀字符
		suffix = filename.substring(pos).replace(/\W/, '')
		if (separator) suffix = `.${suffix}`
	}
	return suffix
}

/**
 * 删除文件夹及该文件夹下的所有子文件（包含子文件夹和子文件夹下的文件）
 * @param path {String}  需要删除的文件夹路径
 * @returns {string}
 */
function deleteFolder (path) {
	let files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path)
		files.forEach((file, index) => {
			let curPath = `${path}/${file}`
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolder(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

/**
 * 数组提取，不改变原数组
 * @param  {Array}  arr   需要进行操作的原始数组
 * @param  {Number} start 截取的初始位置
 * @param  {Number} num   需要截取的个数
 * @return {Array}        截取完成后返回的新数组
 *
 * Test:
 * [1,2,32,'sds','asd',90,'piis']
 *
 *
 */
function copypart (arr, start, num) {
	let ret = []
	if (typeof num === 'number') {
		ret = arr.slice(start, start + num)
	} else {
		ret = arr.slice(start)
	}
	return ret
}

/**
 * 检测传入的参数类型
 * @param obj {All}	需要进行参数检测的对象
 * @return {String} 所属类型字符串
 */
function typeOf (obj) {
	const toString = Object.prototype.toString;
	const map = {
		'[object Boolean]'	 : 'boolean',
		'[object Number]' 	 : 'number',
		'[object String]' 	 : 'string',
		'[object Function]'  : 'function',
		'[object Array]' 	 : 'array',
		'[object Date]' 	 : 'date',
		'[object RegExp]'	 : 'regExp',
		'[object Undefined]' : 'undefined',
		'[object Null]' 	 : 'null',
		'[object Object]' 	 : 'object'
	};
	return map[toString.call(obj)];
}


/**
 * 深拷贝函数
 * @param target {object} 需要拷贝的目标对象
 * @returns {object} 拷贝完成的新对象
 */
function deepCopy (target) {
	const flag = typeOf(target);
	let copy;

	if (flag === 'array') {
		copy = [];
		for (let i = 0, len = target.length; i < len; i++) {
			copy.push(deepCopy(target[i]));
		}
	}
	else if (flag === 'object') {
		copy = {};
		for (let k in target) {
			copy[k] = deepCopy(target[k]);
		}
	}
	else {
		copy = target;
	}
	return copy;
}

/**
 * 睡眠函数
 * @param time {Number} 睡眠毫秒数
 */
function sleep (time) {
	return new Promise(resolve => {
		setTimeout(resolve, time)
	})
}

module.exports = {
	pathResolve,
	getSuffix,
	deleteFolder,
	copypart,
	typeOf,
	deepCopy,
	sleep
}
