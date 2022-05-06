
/*
 * Timeline - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the timeline should use
 */

class Timeline {

    // constructor method to initialize Timeline object
    constructor(parentElement, data){
        this._parentElement = parentElement;
        // No data wrangling, no update sequence
        this._displayData = data;
        this.parseTime = d3.timeParse('%Y');
        data.forEach(d=>{
            d.Date = this.parseTime(d.Date)
        })
        this.initVis();
    }

    // create initVis method for Timeline class
    initVis() {

        // store keyword this which refers to the object it belongs to in variable vis
        let vis = this;

        vis.margin = {top: 10, right: 150, bottom: 40, left: 150};

        vis.width = document.getElementById(vis._parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis._parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis._parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        var maxHeight=d3.max(vis._displayData,d=>d.Mean);
        var minHeight=d3.min(vis._displayData,d=>d.Mean);

        vis.scaleAnomaly = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
            .domain([-1,0,1])

        vis.y = d3.scaleLinear()
            .range([0,vis.height])
            .domain([maxHeight,-maxHeight/2]);

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis._displayData, d=>d.Date));

        vis.area = d3.area()
            .x(d => vis.x(d.Date))
            .y1(d => vis.y(d.Mean))
            .y0(vis.y(0));

        vis.path = vis.svg.append("path")
            .datum(vis._displayData)
            .attr("fill", "darksalmon")
            .attr("class", "area")
            .attr("d", vis.area);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class","axis x-axis")
            .attr("transform", "translate(0," + (vis.y(0)) + ")")
            .call(vis.xAxis);

        vis.svg.append("g")
            .attr("class","axis y-axis")
            .attr("transform", "translate(0, 0)")
            .call(vis.yAxis);

        vis.tooltip = vis.svg.append("g")
            .attr("class","tooltip_class");

        vis.tooltip.append("line")
            .style("stroke", "black")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", vis.height);

        vis.text1 = vis.tooltip.append("text")
            .attr("x", 10)
            .attr("y", 0 )
            .attr("class","population_class");

        vis.text2 = vis.tooltip.append("text")
            .attr("x", 10)
            .attr("y", 20 )
            .attr("class","date_class");

        const mouseover = (event, d) => {
            //g.style("opacity", 0);
            vis.tooltip.style("display", null);
        };

        const mouseout = (event, d) => {
            vis.tooltip.style("display", "none");
        };


        const mousemove = (event) => {
            let xpos = d3.pointer(event)[0];
            vis.tooltip.attr("transform", "translate("+ xpos+" , 0)");
            selectedYear = d3.timeFormat("%Y")(vis.x.invert(xpos));
            worldMap.wrangleData();
        };



        vis.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("opacity", 0)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("mouseover", mouseover);

        vis.svg.append("text")
            .attr("transform","translate("+(vis.width/2 - 100)+","+(vis.height)+")")
            .attr("font-size","10px")
            .text("Global temperature anomaly")
        vis.svg.append("text")
            .attr("transform","translate("+(10)+","+(5)+")")
            .attr("font-size","8px")
            .text("Temperature Anomaly (°C)")
    }
}