const PROXY_CONFIG = [
  {
    context: [
      '/app'
    ],
    target: 'http://localhost:1323',
    secure: false,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    headers: {
      host: 'localhost:1323'
    },
    cookieDomainRewrite: {
      'localhost': 'localhost'
    }
  }
];
module.exports = PROXY_CONFIG;
