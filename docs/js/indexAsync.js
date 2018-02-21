const fetch = require('node-fetch');
const fs = require('fs');

const rp = require('request-promise');
const cheerio = require('cheerio');


let Url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'


let list_restaurant_link = new Array();
let list_objet_restaurant = new Array();

async function scrapAllPages()
{
  let i = 1;
  let j = 0;
  let bool =true;

  do {
    let data = await fetch(Url+i.toString());
    let html = await data.text();
    let real_data = await cheerio.load(html);
    j--;
    if (real_data('.srp-no-results-text').text().length > 15) {
      bool= await false;
    }
    else{
      //console.log(real_data('.poi_card-display-title').text().trim());

       real_data('.poi-card-link').each(
        function(){
          list_restaurant_link[i-1+j]=real_data(this).attr('href');
          console.log(list_restaurant_link[i-1+j]);
          j++;
        }
      );

    }
    i++
  } while (bool);
  console.log(list_restaurant_link.length);
  scrapAllRestaurants();
}

async function scrapAllRestaurants()
{
  console.log('oui');
  for (var j = 0; j < list_restaurant_link.length; j++) {

    let data = await fetch('https://restaurant.michelin.fr'+list_restaurant_link[j]);
    let html = await data.text();
    let real_data = await cheerio.load(html);
    let etoile = 0;
    if (real_data('span.distinction-icon.icon-mr.icon-cotation3etoiles.red') != null) {
      //console.log(real_data('span.distinction-icon.icon-mr.icon-cotation3etoiles.red'));
      etoile = 3;
    }
    else if (real_data('span.distinction-icon.icon-mr.icon-cotation2etoiles.red') != null) {
      etoile = 2;
    }
    else if  (real_data('span.distinction-icon.icon-mr.icon-cotation1etoiles.red') != null) {
      etoile = 1;
    }
    list_objet_restaurant[j]= await{'name':real_data('.poi_intro-display-title').text().trim(),
                              'street':real_data('.thoroughfare').text(),
                              'postalCode':real_data('.postal-code').text(),
                              'town':real_data('.locality').text(),
                              'style':real_data('.poi_intro-display-cuisines').text().trim(),
                              'etoile':etoile
                            };
    fs.appendFile('objectRestaurant.json',JSON.stringify(list_objet_restaurant[j])+"\r\n", null, 2, function (err) {
      if (err) throw err;
    });
    j++;
  }
}

scrapAllPages();
//scrapAllRestaurants();
