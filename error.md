
corepack可能会有如下报错: 

```log
(node:52052) [MODULE_TYPELESS_PACKAGE_JSON] Warning: file:///Users/bytedance/personal-code/customUI/postcss.config.js parsed as an ES module because module syntax was detected; to avoid the performance penalty of syntax detection, add "type": "module" to /Users/bytedance/personal-code/customUI/package.json
(Use `node --trace-warnings ...` to show where the warning was created)
```

解决方案:
添加`.nvmrc`文件, 内容如下:

```
lts/hydrogen  (node 18.14.0 稳定版)
```

但是仍然有报错: 

```log
The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
```