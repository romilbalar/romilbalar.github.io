
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class DisasterViz {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 30, right: 30, bottom: 50, left: 50 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.textlabels= vis.svg.selectAll("text").data(vis.data)
            .enter()
            .append("text")


        var newData = [];
        var sectionWidth = Math.floor(100 / 100);

        for (var i=0; i < 100; i+= sectionWidth ) {
            newData.push(i);
        }

        /*var colorScaleLin = d3.scaleLinear()
            .domain([0, newData.length-1])
            .interpolate(d3.interpolateLab)
            .range(["skyblue", "blue"]);*/

       /* vis.legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (vis.width-sectionWidth-vis.margin.right-150)  + "," + (0-vis.margin.top) + ")")

        vis.legend.selectAll('rect')
            .data(newData)
            .enter()
            .append('rect')
            .attr("x", function(d) { return d; })
            .attr("y", 15)
            .attr("height", 10)
            .attr("width", sectionWidth+50)
            .attr('fill', function(d, i) { return colorScaleLin(i)});

        vis.legend.append("text")
            .attr("transform","translate("+-sectionWidth+",10)")
            .style("font-size", "12px")
            .text("Legend:")

        vis.textmin = vis.legend.append("text")
            .attr("transform","translate(0,40)")
            .style("font-size", "10px")
            .text("0")
        vis.textmax = vis.legend.append("text")
            .attr("transform","translate("+(sectionWidth+130)+",40)")
            .style("font-size", "10px")*/


        // Scales and axes

        vis.x = d3.scaleBand()
            .domain(vis.data.map(function(d) { return d.year; }))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Count");



       /*vis.linearColor = d3.scaleLinear()
            .range(["blue","blue"]);*/

        vis.linearOp = d3.scaleLinear()
            .range([0.1,1]);
        vis.categories=['total','drought','earthquake','extreme_temperature','flood','landslide', 'storm' ]

        vis.linearColor = d3.scaleOrdinal()
            //.range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"])
            .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#17becf","#8c564b","#7f7f7f"])
            .domain(vis.categories)




        vis.selected ='total'
        /*const selectElement = document.querySelector('.disatertype');
        selectElement.addEventListener('change', (event) => {
            console.log('Selected value'+event.target.value);
            vis.selected = event.target.value;
            //vis.displayData.sort(function(a, b){return b[sortorder] - a[sortorder]});
            //console.log(vis.displayData[0])
            d3.select("#disaster_text").text(disaster_data[vis.selected])
            vis.updateVis()
        });*/
        const onclickevent = document.querySelectorAll('.drought, .earthquake, .extreme_temperature, .flood, .landslide, .storm, .total');

        onclickevent.forEach(selectedEvent => {
            selectedEvent.addEventListener('click', (event) =>{
                console.log('****'+event.currentTarget.name);
                vis.selected = event.currentTarget.name;
                //vis.displayData.sort(function(a, b){return b[sortorder] - a[sortorder]});
                //console.log(vis.displayData[0])
                d3.select("#disaster_text").text(disaster_data[vis.selected])
                vis.updateVis()
            });
        });


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        vis.displayData = vis.data;


        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domains

        vis.y.domain([0, d3.max(vis.displayData, d=>d[vis.selected])]);
        //vis.linearColor.domain([0, d3.max(vis.displayData, d=>d[vis.selected])])
        vis.linearOp.domain([0, d3.max(vis.displayData, d=>d[vis.selected])])
       // vis.textmax.text(d3.max(vis.displayData, d=>d[vis.selected]))

        let bars = vis.svg.selectAll(".bar")
            .data(this.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")

            .merge(bars)
            .transition()
            .duration(1000)
            .attr("width", vis.x.bandwidth()-10)
            .attr("height", function (d, i) {
                console.log(i)
                return vis.height - vis.y(d[vis.selected])
            })
            .attr("x", function (d) {
                return vis.x(d.year);
            })
            .attr("y", function (d) {
                return vis.y(d[vis.selected]);
            })
            .attr("fill", function (d) {
                ///console.log(vis.linearColor(d[vis.selected]))
                return vis.linearColor(vis.selected);
            })
            .attr('opacity', d=>
            {
                return vis.linearOp(d[vis.selected])
            });

        bars.exit().remove();

        console.log(vis.displayData.length)
        vis.textlabels.attr('x', (d,i)=>{
            //console.log('x coor'+i)
            if(d[vis.selected]<1000){
                return vis.x(d.year)+(vis.x.bandwidth()/2) - 10;
            }
            else
                return vis.x(d.year)+(vis.x.bandwidth()/2) - 15;

        })
            .attr('y', (d,i)=>{

                return vis.y(d[vis.selected])-15
            })
            .text(d=>d[vis.selected])
            .style("font-size", '10px')

        // Call axis function with the new domain
        vis.svg.select(".y-axis").call(vis.yAxis);

        // TODO: adjust axis labels
        vis.svg.select(".x-axis").call(vis.xAxis).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-50)");

    }


}