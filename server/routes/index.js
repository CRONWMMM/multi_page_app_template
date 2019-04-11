const homeRoute = require('./home')

/**
 * 创建路由的工厂方法
 * @param app express 实例对象
 */
exports.routerFactory = (app) => {
	homeRoute(app)
}
