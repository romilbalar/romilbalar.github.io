// Function to convert date objects to strings or reverse
let dateParser = d3.timeParse("%Y-%Y");


// (1) Load data with promises

d3.csv("data/disasterBinned.csv", d => {
   // const parseTime = d3.timeParse("%Y-%Y");
    //d.year = dateParser(d.year);
    d.total =+ d.total;
    d.drought =+ d.drought;
    d.earthquake =+ d.earthquake;
    d.extreme_temperature =+ d.extreme_temperature;
    d.flood =+ d.flood;
    d.landslide =+ d.landslide;
    d.storm =+ d.storm;
    return d;
}).then( data => {
    console.log(data)
    let disasterData = data;
    let disasterViz = new DisasterViz("disaster-barchart", disasterData);

})



