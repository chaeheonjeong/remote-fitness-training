const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://172.20.10.4:6060",
      changeOrigin: true,
    })
  );
};
