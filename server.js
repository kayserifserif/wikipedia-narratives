const request = require('request');
const cheerio = require('cheerio');

const express = require('express');
const app = express();
const parser = require('body-parser');

var port = process.env.PORT || 3000;

// allow access to static files in public directory
app.use(express.static('public'));
// body parsing middleware, provides req.body
app.use(parser.urlencoded({extended: true}));
// use templating engine
app.set('view engine', 'ejs');

// get random wikipedia page
var randomURL = "https://en.wikipedia.org/wiki/Special:Random#/random";
var chain = [];
var maxChainLength = 6;
var articleLinks = [];

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

      // get article heading and paragraph in context
      var title = $("#firstHeading").html();
      var paragraph = "";
      for (var i = 0; i < articleLinks.length; i++) {
        if (articleLinks[i].url == url) {
          paragraph = articleLinks[i].paragraph;
        }
      }
      chain.push({
        title: title,
        paragraph: paragraph
      });

      if (chain.length < maxChainLength) {
        // get links on page (only those going to other wikipedia articles)
        articleLinks = [];
        $(
          '.mw-parser-output > p > a' + 
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
          // check for existing link with same title
          // https://stackoverflow.com/a/8217584
          if (articleLinks.filter(link => link.title === title).length == 0) {
            var url = 'https://en.wikipedia.org' + $(this).attr('href');
            var url_stub = $(this).attr('href').substring(6); // the part after /wiki/
            // escape for regex
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
            var url_stub_esc = url_stub.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            var search_str = new RegExp("<a href=\"/wiki/" + url_stub_esc + "\"[^<]*</a>");
            var paragraph = $(this).closest("p").html(); // get containing paragraph
            paragraph = paragraph.replace(search_str, "<span class=\"keyword\">$&</span>");
            paragraph = paragraph.replace(/<a[^>]*>|<\/a>/g, ""); // a tags
            paragraph = paragraph.replace(/<sup[^/]*\/[^>]*>(<\/sup>)*/g, ""); // superscript tags
            // add to array
            articleLinks.push({
              title: title,
              url: url,
              url_stub: url_stub,
              paragraph: paragraph
            });
          }
        });

        // shuffle array with Fisher-Yates algorithm
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
  if (req.query.pathType == 'manual') {
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
app.listen(port, function() {
  console.log('App listening on port ' + port + '!');
});