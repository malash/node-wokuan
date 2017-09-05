import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { dependencies, devDependencies, peerDependencies } from './package.json';

const entry = process.env.ENTRY || 'index';
const target = process.env.TARGET || 'es';
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const config = {
  input: `src/${entry}.js`,
  external: Object.keys(Object.assign({}, dependencies, devDependencies, peerDependencies)),
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      // .babelrc
      presets: [
        ['env', {
          targets: {
            node: '4',
          },
          modules: false,
        }],
        'stage-0',
      ],
      plugins: ['external-helpers'],
    }),
  ],
  output: {
    format: target,
    file: `dist/${entry}.${target}.${isProd ? 'min.js' : 'js'}`,
  },
};

export default config;
