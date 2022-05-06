let worldMap;
let timeline;
let selectedYear;
let slide;


let mapButton = document.getElementById("start-map")
mapButton.addEventListener('click',onMapStart)

function updateMap() {
    worldMap.wrangleData();
    selectedYear = selectedYear + 1
    if (selectedYear > 2015) {
        slide.stop();
        mapButton.addEventListener('click',onMapStart)
    }
}

function startMapAnimation() {
    selectedYear= 1880;
    slide = d3.interval(updateMap,100)
}

function onMapStart(){
    mapButton.removeEventListener('click',onMapStart);
    startMapAnimation();
}

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



