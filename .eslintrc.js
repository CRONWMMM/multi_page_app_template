module.exports = {
	root: true,
	extends: 'standard',
	plugins: [
		'html'
	],
	env: {
		browser: true,
		node: true,
		jquery: true
	},
	rules: {
    	"no-mixed-spaces-and-tabs": [0],
		"no-tabs": [0],
		"no-unreachable": [0],
    	"indent": [0],
		"no-unused-vars": [0],
		"import/no-webpack-loader-syntax": [0]
	}
}
