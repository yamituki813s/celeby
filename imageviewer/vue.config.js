const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      //チャンクファイルを生成しないようにする
      config.optimization.delete("splitChunks");

      //メインJSファイル名にハッシュ値をつけない
      config.output.filename("[name].js");

      //imagesに置く画像ファイル名にハッシュ値をつけない
      config.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .options({
          limit: 4096,
          name: "img/[name].[ext]"
        });

      //svgのファイル名にハッシュ値をつけない
      config.module
        .rule("svg")
        .test(/\.(svg)(\?.*)?$/)
        .use("file-loader")
        .loader("file-loader")
        .options({
          name: "img/[name].[ext]"
        });

      //mediaに置くメディアファイル名にハッシュ値をつけない
      config.module
        .rule("media")
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .options({
          limit: 4096,
          name: "media/[name].[ext]"
        });

      //fontsに置くフォントファイル名にハッシュ値をつけない
      config.module
        .rule("fonts")
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .options({
          limit: 4096,
          name: "fonts/[name].[ext]"
        });

      //CSSファイル名にハッシュ値をつけない
      config.plugin("extract-css").use(MiniCssExtractPlugin, [
        {
          filename: "[name].css",
          chunkFilename: ""
        }
      ]);
    }
  }
};
