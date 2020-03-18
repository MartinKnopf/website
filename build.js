var rimraf = require('rimraf');
var Handlebars     = require('handlebars');
var Metalsmith  = require('metalsmith');
var ignore      = require('metalsmith-ignore');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);

// build nested layouts
Metalsmith(__dirname)
  .source('./layouts')
  .destination('./layouts/generated')
  .clean(false)
  .use(layouts({
    engine: 'handlebars',
    directory: './layouts'
  }))
  .build(function(err, files) {
    if (err) { throw err; }

    // build pages
    Metalsmith(__dirname)
      .source('./pages')
      .destination('./dist')
      .clean(true)
      .use(markdown())
      .use(permalinks())
      .use(layouts({
        engine: 'handlebars',
        directory: './layouts/generated'
      }))
      .build(function(err, files) {
        if (err) { throw err; }
      });

    // build blog
    Metalsmith(__dirname)
      .source('./blog')
      .destination('./dist/blog')
      .clean(false)
      .use(collections({
        posts: {
          pattern: 'posts/*.md',
          sortBy: 'date',
          reverse: true
        },
      }))
      .use(markdown())
      .use(permalinks())
      .use(layouts({
        engine: 'handlebars',
        directory: './layouts/generated'
      }))
      .build(function(err, files) {
        if (err) { throw err; }

        // delete generated layouts
        rimraf.sync('./layouts/generated');
      });
  });
