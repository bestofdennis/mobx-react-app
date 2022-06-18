const path = require('path')
const { whenProd, getPlugin, pluginByName } = require('@craco/craco')
module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src')
        },
        configure: (webpackConfig) => {
            // 如何配置 cdn
            let cdn = {
                js: [],
                css: []
            }
            whenProd(() => {
                // externals这里做的事
                // key：需要不参与打包的具体的包
                // value：cdn文件中 挂载于全局的变量名称 为了替换之前在开发环境下
                // 通过import导入的 react/ react-dom
                webpackConfig.externals = {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
                // 配置现成的cdn 资源数组
                cdn = {
                    js: [
                        'https://unpkg.com/react@17.0.2/umd/react.production.min.js',
                        'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js',
                    ],
                    css: []
                }
            })
            // 为了将来配置 htmlWebpackPlugin插件 将来在public/index.html注入
            // cdn资源数组时 准备好的一些现成资源
            const { isFound, match } = getPlugin(
                webpackConfig,
                pluginByName('HtmlWebpackPlugin')
            )
            if (isFound) {
                // 找到了HtmlWebpackPlugin的插件
                match.options.cdn = cdn
            }
            return webpackConfig
        }
    }
}
