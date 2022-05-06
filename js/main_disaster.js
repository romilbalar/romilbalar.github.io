// Function to convert date objects to strings or reverse
let dateParser = d3.timeParse("%Y-%Y");
let disaster_data;


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
    disaster_data = {}
    disaster_data["total"] = "We can see a general increase in all natural disasters ranging from drought to storms";
    disaster_data["drought"] = "Water generally evaporates more quickly at higher temperatures. For that reason, hotter weather can result in drier soils. As high air temperatures sap liquid water from soils and plant leaves, transforming it into atmospheric water vapor via a process called transpiration, ground-level drying will increase in some regions. (Ironically, this additional atmospheric moisture triggers heavier downpours in other regions, which explains why the overall trend in the U.S. has been toward wetter conditions.)";
    disaster_data["earthquake"] = "Glaciers and permanent ice sheets in the planet’s polar regions exert enormous pressure on the bedrock, causing it to warp downward. As the ice melts and that weight is released from the Earth’s crust, the land responds with a rebound, like a slow, giant version of a trampoline.";
    disaster_data["extreme_temperature"] = "The earth's average temperature has risen more than 1°C (1.8°F) since the 1880s due to soaring greenhouse gas emissions caused by human activity. Scientists say this higher level of heat has contributed to worsening weather extremes, including hotter and longer heat waves and extended droughts.";
    disaster_data["flood"] = "A warmer atmosphere holds and subsequently dumps more water. Basically, because of global warming, when it rains, it pours more. Of course, heavier rainfall does not automatically lead to floods, but it increases the potential for them.";
    disaster_data["landslide"] = "Landslides happen for many reasons, set off by earthquakes, volcanic eruptions, or human behavior. But “probably the most common driver we see for landslides worldwide is rainfall.” And climate change is creating more extreme rain events.";
    disaster_data["storm"] = "As more water vapor is evaporated into the atmosphere it becomes fuel for more powerful storms to develop. More heat in the atmosphere and warmer ocean surface temperatures can lead to increased wind speeds in tropical storms. Rising sea levels expose higher locations not usually subjected to the power of the sea and to the erosive forces of waves and currents.";
    let disasterViz = new DisasterViz("disaster-barchart", disasterData);

})



