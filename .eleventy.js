const fs = require('fs');
const htmlmin = require('html-minifier');

module.exports = (eleventyConfig) => {
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addPassthroughCopy({ _public: '/' });
  eleventyConfig.addTransform('html-minifier', function (value, outputPath) {
    if (outputPath.indexOf('.html') > -1) {
      let minified = htmlmin.minify(value, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });
      return minified;
    }
    return value;
  });
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content404 = fs.readFileSync('_site/404.html');
        browserSync.addMiddleware('*', (req, res) => {
          res.write(content404);
          res.end();
        });
      },
    },
  });
  return {
    pathPrefix: '/',
    passthroughFileCopy: true,
  };
};
