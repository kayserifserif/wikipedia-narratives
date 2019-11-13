const request = require('request');
const cheerio = require('cheerio');

const express = require('express');
const app = express();
const parser = require('body-parser');

// allow access to static files in public directory
app.use(express.static('public'));
// body parsing middleware, provides req.body
app.use(parser.urlencoded({extended: true}));
// use templating engine
app.set('view engine', 'ejs');

// get random wikipedia page
var randomURL = "https://en.wikipedia.org/wiki/Special:Random#/random";
var chain = [];
var maxChainLength = 10;

function renderChain(url, isManual, res) {

  // get contents of webpage
  request(url, function(error, response, body) {

    if (error) {

      res.render('chain', {
        articleTitle: null, 
        articleLinks: null,
        error: "Error, please try again"
      });
      return 1;

    } else {

      // parse page
      var $ = cheerio.load(body);

      // get article heading
      chain.push($('#firstHeading').html());

      if (chain.length < maxChainLength) {
        // get links on page (only those going to other wikipedia articles)
        var articleLinks = [];
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
          var title = $(this).attr('title');
          var url = 'https://en.wikipedia.org' + $(this).attr('href');
          var url_stub = $(this).attr('href').substring(6); // the part after /wiki/
          // get sentence/kwic?
          // add to links array (only if not duplicate?)
          articleLinks.push({
            title: title,
            url: url,
            url_stub: url_stub
          });
        });

        // shuffle array
        // Fisher-Yates algorithm from
        // medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        for (var i = articleLinks.length-1; i > 0; i--) {
          var j = Math.floor(Math.random() * i);
          var temp = articleLinks[i];
          articleLinks[i] = articleLinks[j];
          articleLinks[j] = temp;
        }
      }

      if (chain.length < maxChainLength) {
        if (isManual) {
          // render page
          res.render('chain', {
            chain: chain,
            articleLinks: articleLinks,
            error: null
          });
        } else {
          // automatically choose link
          var chosenLink = articleLinks[Math.floor(Math.random() * articleLinks.length)];
          renderChain(chosenLink.url, false, res);
        }
      } else {
        // render without links
        res.render('chain', {
          chain: chain,
          articleLinks: null,
          error: null
        });
      }

    }
  });
}

// load start page
app.get('/', function(req, res) {
  res.render('index');
});

// generate new chain
app.get('/chain', function(req, res) {
  chain = [];
  if (req.query.path_type == 'manual') {
    renderChain(randomURL, true, res);
  } else {
    renderChain(randomURL, false, res);
  }
});

// respond to user action
app.post('/chain', function(req, res) {
  var url = 'https://en.wikipedia.org/wiki/' + req.body.article_link;
  renderChain(url, true, res);
});

// start server
app.listen(3000, function() {
  console.log('App listening on port 3000!');
});