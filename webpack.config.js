import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

const { error: dotenvError } = dotenv.config({ path: envPath, quiet: true });

if (dotenvError && dotenvError.code !== 'ENOENT') {
  throw new Error(`Не удалось прочитать файл переменных окружения "${envPath}".`, {
    cause: dotenvError,
  });
}

export default (_, argv) => {
  const isProd = argv.mode === 'production';
  const apiUrlEnvName = isProd ? 'PRODUCTION_API_URL' : 'DEVELOPMENT_API_URL';
  const apiUrl = process.env[apiUrlEnvName];
  const authLoginUrl = process.env.AUTH_LOGIN_URL?.trim() || undefined;
  const absoluteReturnUrlValue = process.env.AUTH_RETURN_URL_ABSOLUTE?.trim().toLowerCase();
  if (absoluteReturnUrlValue && !['true', 'false'].includes(absoluteReturnUrlValue)) {
    throw new Error('AUTH_RETURN_URL_ABSOLUTE должен быть true или false.');
  }
  const absoluteReturnUrl = absoluteReturnUrlValue !== 'false';
  const developmentToken = isProd ? undefined : process.env.DEVELOPMENT_TOKEN || undefined;
  const basePathValue = (process.env.APP_BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
  const appBasePath = basePathValue ? `/${basePathValue}/` : '/';

  if (authLoginUrl) {
    const parsedLoginUrl = URL.parse(authLoginUrl);
    if (
      !parsedLoginUrl ||
      !['http:', 'https:'].includes(parsedLoginUrl.protocol) ||
      parsedLoginUrl.username ||
      parsedLoginUrl.password
    ) {
      throw new Error('AUTH_LOGIN_URL должен быть полным HTTP(S) URL без логина и пароля.');
    }
  }

  if (!apiUrl) {
    throw new Error(
      `Не задана обязательная переменная окружения ${apiUrlEnvName}. Задайте её в системном окружении, CI/CD или файле .env.`,
    );
  }

  const styleOrExtract = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

  return {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: appBasePath,
    },

    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },

    cache: {
      type: 'filesystem',
      version: appBasePath,
      buildDependencies: { config: [__filename] },
    },

    module: {
      rules: [
        // TypeScript Loader
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.build.json'),
            },
          },
          exclude: /node_modules|(\.test\.tsx?$|\.spec\.tsx?$|__tests__)/,
        },
        // SCSS Modules: *.module.scss
        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            styleOrExtract,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                },
                importLoaders: 2,
                sourceMap: !isProd,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProd,
                postcssOptions: {
                  config: false,
                  plugins: ['autoprefixer'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProd,
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src', 'shared', 'styles')],
                },
              },
            },
          ],
        },
        // Global SCSS: *.scss (кроме *.module.scss)
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: [
            styleOrExtract,
            {
              loader: 'css-loader',
              options: { importLoaders: 2, sourceMap: !isProd },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProd,
                postcssOptions: {
                  config: false,
                  plugins: ['autoprefixer'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProd,
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src', 'shared', 'styles')],
                },
              },
            },
          ],
        },
        // SVG as React component + URL (?url)
        {
          test: /\.svg$/i,
          oneOf: [
            // import iconUrl from "./icon.svg?url"
            {
              resourceQuery: /url/,
              type: 'asset/resource',
              generator: {
                filename: 'assets/[name].[contenthash][ext]',
              },
            },
            // import { ReactComponent as Icon } from "./icon.svg"
            {
              issuer: /\.[jt]sx?$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    svgo: true,
                    titleProp: true,
                    svgoConfig: {
                      plugins: [
                        {
                          name: 'preset-default',
                          params: { overrides: { removeViewBox: false } },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
        // Images / assets
        {
          test: /\.(png|jpe?g|gif|webp|avif|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[contenthash][ext]',
          },
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        __API_URL__: JSON.stringify(apiUrl),
        __AUTH_LOGIN_URL__: JSON.stringify(authLoginUrl),
        __AUTH_RETURN_URL_ABSOLUTE__: JSON.stringify(absoluteReturnUrl),
        __APP_BASE_PATH__: JSON.stringify(appBasePath),
        __DEVELOPMENT_TOKEN__: JSON.stringify(developmentToken),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      ...(isProd ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })] : []),
    ],

    devServer: {
      port: 3000,
      hot: true,
      open: [appBasePath],
      historyApiFallback: { index: `${appBasePath}index.html` },
      static: {
        directory: path.resolve(__dirname, 'public'),
        publicPath: appBasePath,
      },
    },

    performance: isProd
      ? {
          maxAssetSize: 800000,
          maxEntrypointSize: 1024000,
        }
      : false,

    optimization: isProd
      ? {
          splitChunks: { chunks: 'all' },
          runtimeChunk: 'single',
        }
      : undefined,
  };
};
