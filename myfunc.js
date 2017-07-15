var request = require('sync-request');

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var ramal = function() {
  var ramalan = ['halo', 'hehe', 'lala'];
  var ramalanKocok = shuffle(ramalan);
  randomIndex = Math.floor(Math.random() * ramalanKocok.length);
  return ramalan[randomIndex];
}

var wiki = function(keyword) {
  var replaced = keyword.replace(/ /g, '+');
  var url = 'https://id.wikipedia.org/wiki/' + replaced
  var response = request(
    'GET',
    'https://id.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + replaced
  );
  if (response.statusCode == 200) {
    var json = JSON.parse(response.getBody('utf8'));
    var pages = json.query.pages;

    for (i in pages) {
      var teksWiki = pages[i].extract;

      if (teksWiki == '') {
        return 'Link dialihkan ke ' + url;
      } else if (teksWiki == null) {
        return 'tidak ditemukan hasil dengan keyword ' + keyword;
      } else if (teksWiki != null) {
        if (teksWiki.length > 1900) {
          teksWiki = teksWiki.substr(0, 1900) + '...';
        }
        return teksWiki + ' Read More: ' + url;
      }
    }
  }
}

exports.ramal = ramal;
exports.wiki = wiki;
