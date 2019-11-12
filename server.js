const request = require('request')
const cheerio = require('cheerio')

const express = require('express')
const app = express()

// allow access to static files in public directory
app.use(express.static('public'));
// use templating engine
app.set('view engine', 'ejs');

// get random wikipedia page
var randomURL = "https://en.wikipedia.org/wiki/Special:Random#/random";
var initialArticle = {};
var chain = [];

app.get('/', function(req, res) {

  // get contents of webpage
  request(randomURL, function(error, response, body) {

    if (error) {
      res.render('index', {
        articleTitle: null, 
        articleLinks: null,
        error: "Error, please try again"
      });
      return 1;

    } else {

      // parse page
      var $ = cheerio.load(body);

      // set up initial article object
      initialArticle = {
        title: $('#firstHeading').html(),
        url: 'https://en.wikipedia.org' + response.socket._httpMessage.path
      };

      var articleLinks = [];
      // get all links that go to other wikipedia articles
      $(
        '#bodyContent a' + 
          '[href^="/wiki/"]' + 
          ':not' + 
            '(:has(>img),' + 
            '[href^="/wiki/Category:"],' + 
            '[href^="/wiki/Portal:"],' + 
            '[href^="/wiki/Special:"],' + 
            '[href^="/wiki/Wikipedia:"],' + 
            '[href^="/wiki/Template:"],' + 
            '[href^="/wiki/Template_talk:"],' + 
            '[href^="/wiki/Talk:"],' + 
            '[href^="/wiki/Help:"],' + 
            '.internal)'
      ).each(function(i, elem) {
        var url = 'https://en.wikipedia.org' + $(this).attr('href');
        var title = $(this).attr('title');
        // get sentence/kwic?
        // add to links array (only if not duplicate?)
        articleLinks.push({
          url: url,
          title: title,
        });
      });

      // shuffle array
      // Fisher-Yates algorithm from
      // medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
      for (var i = articleLinks.length-1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp_link = articleLinks[i];
        articleLinks[i] = articleLinks[j];
        articleLinks[j] = temp_link;
      }

      // send data to page
      res.render('index', {
        initialArticle: initialArticle,
        links: articleLinks,
        error: null
      });

    }
  });
});

// start server
app.listen(3000, function() {
  console.log('App listening on port 3000!');
});