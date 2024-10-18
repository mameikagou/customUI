# 如何使用测试jest模块

有点过于复杂了

要下的包如下:
```json
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
//   "types":"module" 记得删掉, 因为ESCM一般跑在浏览器端, CJS一般跑在服务端, 所以为了测试这里应该删掉;还有json不能有注释
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
  },
  "devDependencies": {
    "jest": "^29.4.1",
    "jest-environment-jsdom": "^29.4.1",
    "jest-localstorage-mock": "^2.4.18",
    "@types/jest": "^29.4.0",
    "ts-jest": "^29.1.1",
    "@types/mockjs": "^1.0.7",
    "mockjs": "^1.1.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
  },
}
```

要添加的文件: 

match-media-mock.js
```js
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
```

jest.config.js

```js
/** esm modules to transform */
const esmModules = [
    // `query-string` and its related dependencies
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
  ];
  
  module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    clearMocks: true,
    testPathIgnorePatterns: ['/.history/'],
    modulePathIgnorePatterns: ['<rootDir>/package.json'],
    resetMocks: false,
    setupFiles: ['./jest.setup.js', 'jest-localstorage-mock', './match-media-mock.js'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    transform: {
      '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    collectCoverageFrom: [
      '<rootDir>/**/src/**/*.{js,jsx,ts,tsx}',
      '!**/demo/**',
      '!**/example/**',
      '!**/es/**',
      '!**/lib/**',
      '!**/dist/**',
    ],
    transformIgnorePatterns: [`node_modules/(?!(?:.pnpm/)?(${esmModules.join('|')}))`],
  };
```

jest.setup.js

```js
// mock screen full events
// https://github.com/sindresorhus/screenfull/blob/main/index.js
const screenfullMethods = [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
  ];
  screenfullMethods.forEach((item) => {
    document[item] = () => {};
    HTMLElement.prototype[item] = () => {};
  });
  
```