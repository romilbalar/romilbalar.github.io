
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class CO2Viz {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.formatPercent  = d3.format(".2f");

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 90, bottom: 40, left: 50 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.co2grouped = d3.group(vis.data, d=>d.Entity)
        vis.dategrouped = d3.group(vis.data, d=>d.Year)
        console.log('Origi')
        console.log(vis.dategrouped)

        console.log(vis.co2grouped)
        // Scales and axes

        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.data, d=>d.Year))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            //.domain([0, d3.max(vis.data, d=>d.relative)])
            .range([vis.height, 0])
            .domain([0,1000]);
        console.log(vis.x(vis.data[0].Year))

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height  + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -vis.margin.left)
            .attr("y", -10)
            .text("relative emissions");

        vis.svg.append("text")
            .attr("x", vis.width -30 )
            .attr("y", vis.height+30)
            .text("year");


        //var res = d3.values(vis.co2grouped).map(function(d){ return d.key })
        let countries = Array.from(vis.co2grouped.keys())
        vis.selectedCountries= ['India', 'China', 'South Korea', 'Australia', 'Singapore', 'United States']
        vis.color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(vis.selectedCountries)

        vis.tooltip = d3.select("#"+vis.parentElement).append("div")
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style("background-color", "#D3D3D3")
            .style('padding', 6)
            .style('display', 'none')


        vis.g = vis.svg.append("g")
            .attr("class","tooltip_class");

        vis.g.append("line")
            .style("stroke", "black")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", vis.height);



        vis.mouseout = (event, d) => {
            vis.g.style("display", "none");
            d3.selectAll("#tooltip")
                .style('display', 'none');
        };




        vis.mouseover = (event, d) =>{
            vis.g.style("display", null);
            d3.selectAll("#tooltip")
                .style('display', 'block')
        };






        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        vis.displayData = Array.from(vis.co2grouped,  ([key, value]) => ([key, value]))
        vis.dategroupedArray = Array.from(vis.dategrouped,  ([key, value]) => ([key, value]))
        console.log('array')
        console.log(vis.dategroupedArray)
        vis.dategroupedArray.sort(function(a,b){
            return a[0] - b[0]
        })
        console.log('sorted')
        console.log(vis.dategroupedArray)
        //vis.displayData = vis.co2grouped;


        //console.log(vis.displayData)
        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domains

        // vis.y.domain([0, d3.max(vis.displayData, d=>d[vis.selected])]);
        // vis.linearColor.domain([0, d3.max(vis.displayData, d=>d[vis.selected])])
        //vis.textmax.text(d3.max(vis.displayData, d=>d[vis.selected]))

        vis.svg.selectAll(".line")
            .data(vis.displayData)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d) {
                if (vis.selectedCountries.includes(d[0]))
                    return vis.color(d[0])
                // return 'red'
                else
                    return 'grey';
            })
            .attr('opacity', d=>{
                if(vis.selectedCountries.includes(d[0]))
                    return '1';
                else
                    return '0';
            })

            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return vis.x(d.Year); })
                    .y(function(d) { return vis.y(d.relative); })
                    (d[1])
            })

        vis.svg.selectAll('text.label')
            .data(vis.displayData)
            .join('text')
            .attr('class', 'label')
            .attr('x', vis.width - vis.margin.right +30)
            // The BABA stock name sits right on top of another; let's move it up 12 pixels.
            .attr(
                'y',
                d => vis.y(d[1][d[1].length - 1].relative)
            )
            .attr('dy', '0.35em')
            .attr("fill", function(d) {
                if (vis.selectedCountries.includes(d[0]))
                    return vis.color(d[0])
                // return 'red'
                else
                    return 'grey';
            })
            //.style('fill', d => colors(d[0].name))
            .style('font-family', 'sans-serif')
            .style('font-size', 12)
            .text(d => d[0])
            .attr('opacity', d=>{
                if(vis.selectedCountries.includes(d[0]))
                    return '1';
                else
                    return '0';
            })

        // Call axis function with the new domain
        vis.svg.select(".y-axis").call(vis.yAxis);

        // TODO: adjust axis labels
        vis.svg.select(".x-axis").call(vis.xAxis)

        let bisectDate = d3.bisector(d=>d[0]).left;
        let bisectCountry = d3.bisector(d=>d.Entity).left;

        // console.log(vis.dategrouped)


        vis.mousemove = (event, d) => {
            console.log(event)
            //console.log(vis.dategroupedArray)
            vis.xpos = d3.pointer(event)[0];
            const formatTime = d3.timeFormat("%Y");
            let year = formatTime(vis.x.invert(vis.xpos))
            //year= formatTime(year)
            console.log(vis.xpos)
            console.log(year)

            vis.g.attr("transform", "translate("+ vis.xpos+" , 0)");
            var index = bisectDate(vis.dategroupedArray, vis.x.invert(vis.xpos));
            console.log(index)
            index = index-1
            let countriesYear = vis.dategroupedArray[index][1]
            countriesYear.sort((a,b)=>{
                return b.relative - a.relative;
            })
            console.log(countriesYear)


            vis.tooltip.html(`CO2 Emissions <br>
         
             Year: ${year}             
         `)
                .style('display', 'block')
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .style('font-size', 5)
                .selectAll()
                .data(countriesYear).enter() // for each vehicle category, list out name and price of premium
                .append('div')
                .style('color', d => {
                    return vis.color(d.Entity)
                })
                .style('font-size', 10)
                .html(d => {
                    if(vis.selectedCountries.includes(d.Entity))
                        //return  d.values[idx].premium.toString()
                        return d.Entity+ ': '+vis.formatPercent(d.relative)+'%';
                })

        };


        vis.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("opacity", 0)
            .attr("fill", "black")
            .on("mousemove", vis.mousemove)
            .on("mouseout", vis.mouseout)
            .on("mouseover", vis.mouseover);

    }



}