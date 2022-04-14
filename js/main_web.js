let worldMap;
let timeline;
let selectedYear;


let promises = [
    d3.csv("data/Tdata.csv"),
    d3.json("data/countries.geojson"),
    d3.csv("data/global_temp.csv")
];



Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );


// initMainPage
function initMainPage(data) {
    console.log(data[1])
    worldMap = new Worldmap("world-chart", data[0], data[1]);
    timeline =  new Timeline("timeline",data[2]);
}

