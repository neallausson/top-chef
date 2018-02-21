const fetch = require('node-fetch');
const fs = require('fs');

const rp = require('request-promise');
const cheerio = require('cheerio');

let list_objet_restaurant;
//lire le JSON
async function readJson()
{
  fs.readFile('ObjectRestaurant', 'utf8', function (err, data) {
    if (err)
       // error handling

    list_objet_restaurant = JSON.parse(data);
});
scrapLaFourchette();
}

//recuperer id et nom du Restaurants
async function scrapLaFourchette()
{
  for (var y = 0; y < list_objet_restaurant.length; y++) {
    let data = await fetch('https://www.lafourchette.com/recherche/autocomplete?searchText='+ list_objet_restaurant[y]['name']+'&localeCode=fr');
    let html = await data.text();
    let real_data = await cheerio.load(html);

    var object = JSON.parse($.text());
    for (var k = 0; k < object['data']['restaurants'].length; k++) {
      console.log(object['data']['restaurants'][k]['name']);
    }

  }
}
readJson();
