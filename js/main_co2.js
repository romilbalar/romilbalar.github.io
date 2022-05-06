// Function to convert date objects to strings or reverse
let dateParserCo2 = d3.timeParse("%Y");

d3.csv("data/co2_emissions1980.csv", d => {

    d.Year = dateParserCo2(d.Year);
    d.relative =+ d.relative;
    d.Annual_CO2_emissions =+ d.Annual_CO2_emissions;
    return d;
}).then( data => {
    console.log(data)
    let CO2Data = data;
    let co2Viz = new CO2Viz("co2-chart", CO2Data);
})
