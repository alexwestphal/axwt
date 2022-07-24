
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const sourceRoot = path.resolve(__dirname, 'src', 'main', 'typescript', 'frontend');

module.exports = (env, argv) => {

    return {
        entry: {
            "axwt-core": path.resolve(sourceRoot, 'core', 'entry.tsx')
        },
        devtool: 'source-map',
        devServer: {
            compress: true,
            port: 9000,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            progress: true,
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'target', 'frontend', 'js'),
            sourceMapFilename: '[file].map',
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'AXWT',
                minify: false
            }),
            new WebpackManifestPlugin({
                fileName: path.resolve(__dirname, 'target', 'classes', 'manifest.json'),
                publicPath: ""
            })
        ],
        resolve: {
            extensions: ['.webpack.js', '.ts', '.tsx', '.js'],
            plugins: [new TsconfigPathsPlugin()]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'ts-loader'
                    }]
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                }
            ],
        },
        optimization: {
            moduleIds: "natural",
            splitChunks: {
                cacheGroups: {

                },
            }
        }
    }
}