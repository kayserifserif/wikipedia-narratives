const request = require('request')
const cheerio = require('cheerio')

const express = require('express')
const app = express()

// allow access to static files in public directory
app.use(express.static('public'));
// use templating engine
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  // get random wikipedia page
  let randomURL = "https://en.wikipedia.org/wiki/Special:Random#/random";
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
      var links = [];
      var linkTexts = [];
      // get links that go to other wikipedia articles
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
        var linkText = $(this).attr('title');
        // only add if not duplicate
        if (!linkTexts.includes(linkText)) {
          var link = '<a href="' + 'https://en.wikipedia.org' + $(this).attr('href') + '">' +
            $(this).attr('title') + '</a>';
          // add to links array
          links.push(link);
          linkTexts.push(linkText);
        }
      });

      // shuffle arrays
      // Fisher-Yates algorithm from
      // medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
      for (var i = links.length-1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp_link = links[i];
        var temp_linkText = linkTexts[i];
        links[i] = links[j];
        linkTexts[i] = linkTexts[j];
        links[j] = temp_link;
        linkTexts[j] = temp_linkText;
      }

      // send data to page
      res.render('index', {
        articleTitle: $('#firstHeading').html(),
        articleLinks: links,
        articleLinkTexts: linkTexts,
        error: null
      });

    }
  });
});

// start server
app.listen(3000, function() {
  console.log('App listening on port 3000!');
});