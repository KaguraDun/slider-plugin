const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  target: 'web',
  // Where webpack looks to start building the bundle
  entry: {
    example: `${paths.example}/example.ts`,
    slider: `${paths.src}/ts/slider.ts`, 
  },
  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].[fullhash].js',
    publicPath: '',
  },
  cache: {
    // 1. Set cache type to filesystem
    type: 'filesystem',
    allowCollectingMemory: true,
    buildDependencies: {
      // 2. Add your config as buildDependency to get cache invalidation on config change
      config: [__filename],

      // 3. If you have other things the build depends on you can add them here
      // Note that webpack, loaders and all modules referenced from your config are automatically added
    },
  },


  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    new ESLintPlugin({
      files: ['.', 'src', 'config'],
      extensions: ['ts', 'js'],
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint/.eslintcache',
    }),
    
    new StylelintPlugin({ fix: true }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      chunks: ['example'],
      favicon: `${paths.src}/images/favicon.png`,
      template: `${paths.src}/template.html`, // template file
      filename: 'example.html', // output file
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
      },

      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][contenthash][ext]',
        },
      },

      // Fonts and SVGs: Inline files
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][contenthash][[ext]',
        },
      },

      {
        test: /\.(svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/icons/[name][contenthash][[ext]',
        },
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[name][contenthash][[ext]',
        },
      },
    ],
  },
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': paths.src,
      '@/helpers': `${paths.src}/helpers`,
      '@/images': `${paths.src}/images`,
      '@/models': `${paths.src}/models`,
      '@/observer': `${paths.src}/observer`,
      '@/presenter': `${paths.src}/presenter`,
      '@/styles': `${paths.src}/styles`,
      '@/tests': `${paths.src}/tests`,
      '@/ts': `${paths.src}/ts`,
      '@/views': `${paths.src}/views`,
    },
  },
  optimization: { 
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
