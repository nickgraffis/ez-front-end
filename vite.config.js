import { resolve } from 'path';
import { helpers } from './src/helpers';
import handlebars from './vite-plugin-handlebars';

export default {
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src'),
      context() {
        return {
          test: 'Chad'
        };
      },
      registerHelpers: helpers
    }),
  ],
};