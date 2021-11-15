const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
/* the entry here means where your index.js file can be found. Following the folder structure above, index.js will be located in ./src/index.js. */
  entry: "./src/index.js",
/* the output here means where your final built JS file will be located, along with the index.html; this JS file will contain all your linked dependencies and components similar to your .js after you run the babel transpiler shown in the lectures. If this doesn't make sense now, you can just follow the instructions, then see what it does later on.*/
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
  },
/* the module: rules here are instructions on how Webpack should preprocess files ending with the specified RegEx. This is how we can import CSS into the React app. */
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      /*Choose only one of the following two: if you're using 
      plain CSS, use the first one, and if you're using a
      preprocessor, in this case SASS, use the second one*/
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ], 
  },
/* this plugin here is what creates the index.html in the /dist folder with bundle.js once you run npm run build later on. The template HTML we want it to follow is in the src folder. Therefore the path is structured as such.*/  
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html"
    }),
  ]
}