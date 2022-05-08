class Worldmap {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, tempData, geoData) {
        console.log(tempData);
        this.parentElement = parentElement;
        this.tempData = tempData;
        this.geoData = geoData;
        this.displayData = [];
        console.log(geoData)
        this.initVis();

    }

    initVis(){
        // init drawing area
        let vis = this;
        vis.margin = {top: 10, right: 10, bottom: 30, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;
        console.log(this.geoData.features)
        vis.path = d3.geoPath();
        vis.projection = d3.geoMercator()
            .scale(120)
            .center([0,20])
            .translate([vis.width / 2, vis.height / 2 + 100]);

        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "state")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`)
            .selectAll(".states")
            .data(vis.geoData.features)

        vis.countries = vis.map.enter()
            .append("path")
            .attr('class', 'states')
            .attr("d", vis.path.projection(vis.projection))
            .attr("opacity",d=>{
                if (d.properties.ADMIN == "Greenland"){
                    return 0
                }
                else{
                    return 1
                }
            })
            .style("fill","grey");
        selectedYear = "1980";

        vis.scaleAnomaly = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
            .domain([-1,0,1])

        vis.newData = [];
        vis.sectionWidth = 0.01;

        for (var i=-1; i <= 1; i+= vis.sectionWidth ) {
            vis.newData.push(i);
        }
        vis.legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (150)  + "," + (vis.height-50) + ")")

        vis.legend.selectAll('rect')
            .data(vis.newData)
            .enter()
            .append('rect')
            .attr("x", function(d) { return (d*50); })
            .attr("y", 15)
            .attr("height", 5)
            .attr("width", 0.5)
            .attr('fill', function(d, i) { return vis.scaleAnomaly(d)});

        /*
        vis.legend.append("text")
            .attr("transform","translate(-50,10)")
            .style("font-size", "10px")
            .text("Legend:")

         */

        vis.legend.append("text")
            .attr("transform","translate(-60,30)")
            .style("font-size", "8px")
            .text('-2°C')
        vis.legend.append("text")
            .attr("transform","translate(0,30)")
            .style("font-size", "8px")
            .text('0°C')
        vis.legend.append("text")
            .attr("transform","translate(50,30)")
            .style("font-size", "8px")
            .text('2°C')

        /*
        vis.textmax = vis.legend.append("text")
            .attr("transform","translate("+(sectionWidth+130)+",40)")
            .style("font-size", "10px")

         */
        vis.year_text = vis.svg.append("text")
            .attr("transform","translate("+(vis.width - 200)+",40)")
            .attr("class","map_year_text")
            .style("font-size","20px")
            .style("font-family","Georgia")
        /*
        vis.heading = vis.svg.append("text")
            .attr("transform","translate("+(vis.width/2 - 200)+",15)")
            .style("font-size","18px")
            .style("font-family","Georgia")
            .text("Temperature anomalies over the years")
         */

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')

        vis.wrangleData();

    }

    wrangleData(){

        let vis = this

        // first, filter according to selectedTimeRange, init empty array

        vis.countryInfo = {}
        // if there is a region selected
        if (selectedYear != "") {
            //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.tempData.forEach(row => {
                // and push rows with proper dates into filteredData
                let countryId = row["ISOA3"]
                let countryName = row["Country"]
                let tempChange = row[selectedYear]
                vis.countryInfo[countryId] = {
                    id: countryId,
                    country: countryName,
                    tempChange: tempChange
                }
            });
        }
        //console.log('final data structure for myDataTable', vis.stateInfo);
        console.log(vis.countryInfo)
        vis.updateVis();
    }

    updateVis(){
        let vis =  this;
        vis.countries.merge(vis.map)
            .style("fill", (d) => {
                if (vis.countryInfo[d.properties.ISO_A3] == undefined){
                    return "grey"
                }
                return vis.scaleAnomaly(vis.countryInfo[d.properties.ISO_A3]["tempChange"]);
            })
            .style("stroke", "grey")
            .style("stroke-width","0.5px")
            .on("mouseover", function (event, d) {
                // Fill Red
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')

                // Update tool tip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
         <h3>${vis.countryInfo[d.properties.ISO_A3].country}<h3>
         <h4> Temp Anamoly: ${vis.countryInfo[d.properties.ISO_A3].tempChange}</h4>
     </div>`);

            })
            .on("mouseout", function (event, data) {

                // Reset everything
                d3.select(this)
                    .style("stroke", 'grey')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
        vis.year_text.text(selectedYear);
    }

}