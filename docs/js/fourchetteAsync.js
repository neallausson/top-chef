const fetch = require('node-fetch');
const fs = require('fs');

const rp = require('request-promise');
const cheerio = require('cheerio');

let list_objet_restaurant = new Array();
let content ;
let list_json_lafourchette = new Array();
//lire le JSON
async function readJson()
{
  fs.readFile('ObjectRestaurant.json', 'utf8', function (err, data) {
    if (err)
    {
      console.log(err);
    }


    list_objet_restaurant = JSON.parse(data);
    console.log(list_objet_restaurant[1]);
    scrapLaFourchette();
});
console.log("i read the file");


}


//var myHeaders = new Headers();
//myHeaders.append('Cookie': 'AHrlqAAAAAMAQOmL32KcSd4ALtotww==');

//var myInit = { method: 'GET',headers: myHeaders,mode: 'cors',cache: 'default' };
//recuperer id et nom du Restaurants
async function scrapLaFourchette()
{
  for (var y = 0; y < list_objet_restaurant.length; y++) {
    if (list_objet_restaurant[y] != null) {
      let data = await fetch('https://www.lafourchette.com/recherche/autocomplete?searchText='+ list_objet_restaurant[y]['name']+'&localeCode=fr',{
  method: "GET",
  headers: {
    'Accept': 'application/json', // This is set on request
    'Content-Type': 'application/json', // This is set on request
    'X-CSRF-Token': 'abcdefghijklmnop', // This is set on request
    'Cache': 'no-cache', // This is set on request
    credentials: 'same-origin', // This is set on request
    'Cookie': 'AHrlqAAAAAMAQOmL32KcSd4ALtotww==' // This is missing from request
  }
});
      let html = await data.text();
      let real_data = await cheerio.load(html);

      list_json_lafourchette[y] = await data;
      //var object = await JSON.parse(real_data.text());

    }
    await filtreApiFourchette(/*object*/);

  }
}

async function filtreApiFourchette(/*object*/)
{

  /*for (var k = 0; k < object['data']['restaurants'].length; k++) {
    console.log(object['data']['restaurants'][k]['name']);
  }*/
  for (var i = 0; i < list_json_lafourchette.length; i++) {
    //console.log(JSON.parse(list_json_lafourchette[i]));
    console.log(list_json_lafourchette[i]);
  }
}

readJson();
