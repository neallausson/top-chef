
//import fetch from 'node-fetch';
const fetch = require('node-fetch');


const rp = require('request-promise');
const cheerio = require('cheerio');


var Url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'

var i = 1;
var bool =true;
var list_restaurant = new Array();

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
     //a terme dans un tableau
     //console.log($('.poi_card-display-title').text());
     console.log($('.poi-card-link').attr('href'));
     list_restaurant[i-1]=$('.poi-card-link').attr('href');

     if ($('.srp-no-results-text').text().length > 15) {
       bool=false
     }
     //Url
   })
   .catch((err) => {
     console.log(err);
   });






 i++;
} while (i<36);

console.log(i);
console.log(list_restaurant.length);

var list_objet_restaurant = new Array();

for (var j = 0; j < list_restaurant.length; j++) {
  //console.log('i :'+ list_restaurant[i]);
  var options = {
    uri: 'https://restaurant.michelin.fr'+list_restaurant[j],
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(($) => {
      list_objet_restaurant[j]={'nom':$('.poi_intro-display-title op-upper-var2__title').text(),
                                'rue':$('.thoroughfare').text(),
                                'ville':$('.postal-code').text()+' '+$('.locality').text(),
                                'style':$('.poi_intro-display-cuisines opt-upper__cuisines-info').text()}
    })
    .catch((err) => {
      console.log(err);
    });

}
function TabRestaurants()
{

}

//TabRestaurants();

console.log("succed");
