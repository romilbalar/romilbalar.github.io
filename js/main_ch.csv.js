/// Co2 vs HDI graph ///

let scatterchart;
let yearRange;
let selected_year;
let interval;
let countries;
let yearText;
let countryData;
let countryIcons;

let button = document.getElementById("start-chart")

function onClick(){
    button.removeEventListener('click',onClick);
    startAnimation();
}

button.addEventListener('click',onClick, false);

d3.csv("data/carbon_vs_hdi_history.csv", d => {
    d.CO2 = +d.CO2;
    d.HDI= +d.HDI;
    d.perCapita = +d.perCapita;
    d.Year = +d.Year;
    d.pre_CO2 = +d.pre_CO2;
    d.pre_HDI = +d.pre_HDI;
    d.pre_perCapita = +d.pre_perCapita;
    return d;
}).then( data => {initScatterChart(data)})


function initScatterChart(data) {
    yearRange = d3.extent(data,d=>d.Year);
    selected_year = 0
    scatterchart = new ScatterChart("scatter-chart", data);
    yearText = d3.select("#year-text").append("text")
    countryIcons = {}
    countryIcons["United States"] = "https://hatscripts.github.io/circle-flags/flags/us.svg";
    countryIcons["China"] = "https://hatscripts.github.io/circle-flags/flags/cn.svg";
    countryIcons["Australia"] = "https://hatscripts.github.io/circle-flags/flags/au.svg";
    countryIcons["South Korea"] = "https://hatscripts.github.io/circle-flags/flags/kr.svg";
    countryIcons["Singapore"] = "https://hatscripts.github.io/circle-flags/flags/sg.svg";
    countryIcons["India"] = "https://hatscripts.github.io/circle-flags/flags/in.svg";
    countryIcons["Libya"] = "https://hatscripts.github.io/circle-flags/flags/ly.svg";
}

function startAnimation(){
    countries = []
    countryData = []
    if(d3.select("#myCheckbox1").property("checked")){
        countries.push("United States")
        countryData.push("United States has emitted a total of 391 billion tonnes of CO2 during its development. This accounts to 25% of total emissions during this time.")
    }
    if(d3.select("#myCheckbox2").property("checked")){
        countries.push("China")
        countryData.push("China is the largest contributor of Co2 today with around 2500% increase in past 4 decades.")
    }
    if(d3.select("#myCheckbox3").property("checked")){
        countries.push("Australia")
        countryData.push("Australia is one of the populous country which has highest per capita emissions next to United States.")
    }
    if(d3.select("#myCheckbox4").property("checked")){
        countries.push("South Korea")
        countryData.push("South Korea is one of the country's which had relatively low carbon foot print during its development and also pledged to become carbon neutral by 2050.")
    }
    if(d3.select("#myCheckbox5").property("checked")){
        countries.push("Singapore")
        countryData.push("Singapore took significant effort to reduce co2 emissions by using natural gas for 95 percent of electricity needs.")
    }
    if(d3.select("#myCheckbox6").property("checked")){
        countries.push("India")
        countryData.push("India is one of the developing countries contributing to large amount of Co2 emissions today but is not a large contributor in a historical context.")
    }
    if(d3.select("#myCheckbox7").property("checked")){
        countries.push("Libya")
        countryData.push("Libya is an under developed country with significantly low emissions.")
    }
    if (countries.length == 0){
        yearText.text("Select at least one country");
        button.addEventListener('click',onClick, false);
        return;
    }

    d3.select("#dynamic_text").html("");

    startTransition();
}

function updateChart() {
    scatterchart.wrangleData();
    selected_year = selected_year + 1
    if (selected_year > yearRange[1]) {
        interval.stop();
        countryData.forEach(d=>{
            d3.select("#dynamic_text").append("p").text(d).style('color',scatterchart.colorPalette(d));
        })
        button.addEventListener('click',onClick, false);
    }
}

function startTransition(){
    console.log(yearRange)
    selected_year = scatterchart.getMinYear();
    interval = d3.interval(updateChart,50)
}

