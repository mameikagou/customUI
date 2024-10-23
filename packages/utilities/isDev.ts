// 判断是否是开发环境来提供报错

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export default isDev;
