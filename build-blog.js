var path = require('path');
var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);

Metalsmith(path.join(__dirname, '/pages/blog'))
  .metadata({
    title: "flatbutton blog",
    description: "news, how-tos",
    generator: "Metalsmith",
    url: "https://flatbutton.co"
  })
  .source('./src')
  .destination('./build')
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
    engine: 'handlebars'
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });
