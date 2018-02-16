const fetch = require('node-fetch');


const rp = require('request-promise');
const cheerio = require('cheerio');


let Url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'


let list_restaurant_link = new Array();
let list_objet_restaurant = new Array();

async function scrapAllPages()
{
  let i = 1;
  let bool =true;

  do {
    let data = await fetch(Url+i.toString());
    let html = await data.text();
    let real_data = await cheerio.load(html);


    if (real_data('.srp-no-results-text').text().length > 15) {
      bool= await false;
    }
    else{
      //console.log(real_data('.poi_card-display-title').text().trim());

      list_restaurant_link[i-1]= await real_data('.poi-card-link').attr('href');
      console.log(list_restaurant_link[i-1]);
    }
    i++
  } while (bool);
  console.log(list_restaurant_link.length);
}

async function scrapAllRestaurants()
{
  console.log('oui');
  for (var j = 0; j < list_restaurant_link.length; j++) {

    let data = await fetch('https://restaurant.michelin.fr'+list_restaurant_link[j]);
    let html = await data.text();
    let real_data = await cheerio.load(html);

    list_objet_restaurant[j]= await{'name':real_data('.poi_intro-display-title op-upper-var2__title').text(),
                              'street':real_data('.thoroughfare').text(),
                              'postalCode':real_data('.postal-code').text(),
                              'town':real_data('.locality').text(),
                              'style':real_data('.poi_intro-display-cuisines opt-upper__cuisines-info').text()};

    console.log(list_objet_restaurant[j]);
    console.log('oui');
    j++;
  }
}

scrapAllPages();
scrapAllRestaurants();
