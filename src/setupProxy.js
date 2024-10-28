const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
          target: process.env.REACT_APP_BCKEND,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '', // Elimina el prefijo /api al redirigir la petición
          },
        })
      );
};