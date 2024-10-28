import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 用来分析打包体积的插件

export default defineConfig({
    tools: {
        rspack: {
          plugins: [new BundleAnalyzerPlugin()]
        }
      },
    plugins: [pluginReact()],
    html: {
        template: './index.html',
    },
    source: {
        entry: {
            index: './packages/main.tsx',
        },
        alias: {
            '@': './packages',
          },
    },
});
