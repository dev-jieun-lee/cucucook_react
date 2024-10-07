module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === "development") {
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

      return middlewares;
    },
  },
};
