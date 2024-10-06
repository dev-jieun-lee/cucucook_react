module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // development 환경에서만 소스 맵 비활성화
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        webpackConfig.devtool = false;
      }
      return webpackConfig;
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      // API 요청 처리 설정
      devServer.app.get("/some-api", (req, res) => {
        res.json({ data: "API response" });
      });

      return middlewares;
    },
  },
};
