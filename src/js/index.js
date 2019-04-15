// styles
import 'less/index.less'

async function a () {
	let res = await b()
	console.log(res)
}

function b () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('hello')
		}, 3000)
	})
}

a()

console.log('sdasdf'.includes('s'))
