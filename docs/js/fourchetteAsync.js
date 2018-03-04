const fetch = require('node-fetch');
const fs = require('fs');

const rp = require('request-promise');
const cheerio = require('cheerio');

let list_objet_restaurant = new Array();
let content ;
let list_json_lafourchette = new Array();
let list_filter_lafourchette = new Array();
let final_lafourchette = new Array();
//lire le JSON
async function readJson()
{
  fs.readFile('ObjectRestaurant.json', 'utf8', function (err, data) {
    if (err)
    {
      console.log(err);
    }


    list_objet_restaurant = JSON.parse(data);
    //console.log(list_objet_restaurant[0]['name']);
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
  for (var y =600; y < 650/*list_objet_restaurant.length*/; y++) {
    if (list_objet_restaurant[y] != null) {
      console.log(y);
      let data = await fetch('https://www.lafourchette.com/recherche/autocomplete?searchText='+ list_objet_restaurant[y]['name'].trim()+'&localeCode=fr',{
        method: "GET",
        headers: {
          //'Accept': 'application/json', // This is set on request
          //'Content-Type': 'application/json', // This is set on request
          //'X-CSRF-Token': 'abcdefghijklmnop', // This is set on request
          //'Cache': 'no-cache', // This is set on request
          //credentials: 'same-origin', // This is set on request
          'Cookie': 'datadome=AHrlqAAAAAMAtXQB0LO1y9MAWl0ANA==', // This is missing from request
          'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)'
        }
      });
      console.log(data);
      let html = await data.text();
      console.log(html);
      //let real_data = await cheerio.load(html);
      //console.log(real_data);
      if (html.length>100) {
        var object = await JSON.parse(html);

        list_json_lafourchette[y] = await object['data']['restaurants'];
        console.log(object['data']['restaurants']);
      }

      console.log('fin request \n')
    }


  }
  await filtreApiFourchette(/*object*/);
}

async function filtreApiFourchette(/*object*/)
{
  console.log('commence le filtrage \n');
  for (var k = 0; k < list_json_lafourchette.length; k++) {
    list_filter_lafourchette[k] = new Array();
    let compteur =0;
    if (list_json_lafourchette[k]!=null) {
      for (var i = 0; i < list_json_lafourchette[k].length; i++) {

        let zipcode = list_json_lafourchette[k][i]['zipcode'];
        let town = list_json_lafourchette[k][i]['city'];
        if (true /*list_objet_restaurant[k]['town'].substring(list_objet_restaurant[k]['town'].lentgh/2)==town /*&& list_objet_restaurant[k]['postalCode'].substring(list_objet_restaurant[k]['postalCode'].lentgh/2)==zipcode */) {
          list_filter_lafourchette[k][compteur]= list_json_lafourchette[k][i];
          console.log(list_json_lafourchette[k][i]['name']);
          console.log(list_json_lafourchette[k][i]['id_restaurant']);
          compteur++;
        }
      }
    }


  }
  console.log('fin filtrage \n');
  let compteur=0;
  for (var i = 0; i < list_filter_lafourchette.length; i++) {
    if (list_filter_lafourchette[i]!=null) {
      console.log(list_filter_lafourchette[i].length);
      if (list_filter_lafourchette[i].length == 1) //un seul restaurant parfait
      {
        console.log('j ajoute un restaurant' );
        final_lafourchette[compteur]= await{
          'id':list_filter_lafourchette[i][0]['id_restaurant'],
          'name_michelin':list_objet_restaurant[i]['name'],
          'name_lafourchette':list_filter_lafourchette[i][0]['name'],
          'street':list_objet_restaurant[i]['street'].substring(list_objet_restaurant[i]['street'].length/2),
          'postalCode':list_objet_restaurant[i]['postalCode'].substring(list_objet_restaurant[i]['postalCode'].length/2),
          'town':list_objet_restaurant[i]['town'].substring(list_objet_restaurant[i]['town'].length/2),
          'style':list_objet_restaurant[i]['style'],
          'etoile':list_objet_restaurant[i]['etoile']
        };
        compteur++;
      }
    }

  }
  fs.appendFile('FinalFourchette.json',JSON.stringify(final_lafourchette),null, function (err) {
    if (err) throw err;
  });
}

readJson();
