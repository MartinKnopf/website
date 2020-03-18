var fs = require('fs');
var path = require('path');
var Handlebars     = require('handlebars');
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);

Metalsmith(__dirname)
  .source('./pages')
  .destination('./dist')
  .clean(true)
  .use(markdown())
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });

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
    directory: 'layouts'
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
