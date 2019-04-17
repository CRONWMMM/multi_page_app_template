// styles
import 'less/index.less'

async function welcome () {
	let res = await sayHello()
	console.log(res)
}

function sayHello () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('hello world')
		}, 2000)
	})
}

welcome()

if (module.hot) {
	module.hot.accept()
}
