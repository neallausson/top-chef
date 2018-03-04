// class :  pull-left restaurantSummary-price
//https://www.lafourchette.com/restaurant/le-jardin-des-remparts/4988
//class : saleType-title


const fetch = require('node-fetch');
const fs = require('fs');

const rp = require('request-promise');
const cheerio = require('cheerio');

let list_objet_fourchette = new Array();
let price ='';
let saleType = '';
let deal_lafourchette = new Array();

//lire le JSON
async function readJson()
{
  fs.readFile('FinalFourchette.json', 'utf8', function (err, data) {
    if (err)
    {
      console.log(err);
    }


    list_objet_fourchette = JSON.parse(data);
    scrapDeal();
});
console.log("i read the file");


}

//var myInit = { method: 'GET',headers: myHeaders,mode: 'cors',cache: 'default' };
//recuperer id et nom du Restaurants
async function scrapDeal()
{
  for (var y = 0; y < 50/*list_objet_fourchette.length*/; y++) {
    if (list_objet_fourchette[y] != null) {
      console.log(y);
      let data = await fetch('https://www.lafourchette.com/restaurant/'+list_objet_fourchette[y]['name_lafourchette']+'/'+ list_objet_fourchette[y]['id'],{
        method: "GET",
        headers: {
          //'Accept': 'application/json', // This is set on request
          //'Content-Type': 'application/json', // This is set on request
          //'X-CSRF-Token': 'abcdefghijklmnop', // This is set on request
          //'Cache': 'no-cache', // This is set on request
          //credentials: 'same-origin', // This is set on request
          'Cookie': 'datadome=AHrlqAAAAAMA-KjJaL7purMAWl0ANA==', // This is missing from request
          'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)'
        }
      });
      //console.log(data);
      let html = await data.text();
      //console.log(html);
      let real_data = await cheerio.load(html);
      //console.log(real_data);


      console.log('fin request \n')
      console.log('cherche deal \n');


     price = await real_data('.pull-left.restaurantSummary-price').text().trim();
     console.log(price);
     deal_lafourchette[y]= await{
       'name':list_objet_fourchette[y]['name_lafourchette'],
       'street':list_objet_fourchette[y]['street'],
       'postalcode':list_objet_fourchette[y]['postalcode'],
       'town':list_objet_fourchette[y]['town'],
       'style':list_objet_fourchette[y]['style'],
       'etoile':list_objet_fourchette[y]['etoile'],
       'price':price,
       'sale':new Array()
     };

     //let saleType = await real_data('.saleType-title').text().trim();
     //console.log(saleType);
    let compteur = 0 ;
    real_data('.saleType-title').each(
       function(){
         saleType= real_data(this).text();
         //saleType = 'sale';
         deal_lafourchette[y][compteur]=saleType;
         console.log(saleType);
         compteur++;
       });

    }


  }
  fs.appendFile('Deal.json',JSON.stringify(deal_lafourchette),null, function (err) {
    if (err) throw err;
  });
}


readJson();
