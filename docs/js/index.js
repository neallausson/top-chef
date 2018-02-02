

const rp = require('request-promise');
const cheerio = require('cheerio');

var Url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'

var i = 1;

console.log(Url+i.toString());
do {
  var options = {
    uri: Url+i.toString(),
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(($) => {
      console.log($('.poi_card-display-title').text());
      //Url
    })
    .catch((err) => {
      console.log(err);
    });

  i++;
} while (i<5);


function TabRestaurants()
{
  console.log(options.transform());
}

//TabRestaurants();

console.log("succed");
