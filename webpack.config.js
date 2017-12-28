module.exports = function (env) {
    switch (env) {
        case 'prod':
        case 'production':
            return require('./config/prod/webpack.prod')
            break
        case 'sit':
            return require('./config/sit/webpack.prod')
            break
        case 'dit':
            return require('./config/dit/webpack.prod')
            break
        case 'test':
        case 'testing':
            return require('./config/webpack.test')
            break
        case 'dev':
        default:
            return require('./config/webpack.dev')
    }
}