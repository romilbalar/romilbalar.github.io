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
        vis.margin = {top: 10, right: 40, bottom: 10, left: 40};

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
            .style("fill","grey");
        selectedYear = "1980";

        vis.scaleAnomaly = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
            .domain([-1,0,1])

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
    }

}