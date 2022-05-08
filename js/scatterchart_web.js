/*
 * Timeline - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the timeline should use
 */

class ScatterChart {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this._parentElement = parentElement;
        this._displayData = data;
        this._movingData = data;
        this.data = data;
        console.log(this.data);
        this.initVis();
    }

    // create initVis method for Timeline class
    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 40, bottom: 50, left: 30};

        vis.width = document.getElementById(vis._parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis._parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis._parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        vis.co2range = d3.extent(vis.data, d=>{
            return d.CO2;
        })
        vis.hdirange = d3.extent(vis.data, d=>{
            return d.HDI;
        })

        vis.percapitaRange = d3.extent(vis.data, d=>{
            return d.perCapita;
        })

        //var padding = 50
        vis.x = d3.scaleLinear()
            .domain([0,vis.hdirange[1]+0.1])
            .range([0,vis.width])

        vis.y = d3.scaleLinear()
            .range([vis.height-45, 0])

        vis.Countries = new Set(vis.data.map(d=>{
            return d.Country;
        }));

        vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10)
            .domain([vis.Countries])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height-45) + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");
        //vis.ytext = d3.select("#year-text").append("text")
        /*
        svg.append("g")
            .attr("transform", "rotate(270,8,"+height/2+")")
            .append("text")
            .attr("class", "axis axis-label")
            .attr("x",8)
            .attr("y",(height)/2)
            .text("Life Expectancy")

         */
        vis.xLabel = vis.svg.append("text")
            .attr("class",'labels x-label')
            .attr("x", vis.width/2 - 100)
            .attr("y", vis.height - 15)

        vis.yLabel = vis.svg.append("text")
            .attr("class",'labels x-label')
            .attr("x", 10)
            .attr("y", 10)
        // this.wrangleData()
    }

    wrangleData() {
        let vis = this;
        vis.filtered_data = []
        vis._movingData = []
        countries.forEach(country=>{
            vis.filtered_data = d3.merge([vis.filtered_data,vis.data.filter(d=>{
                return d.Country == country
            })])
        })
        if (selected_year != 0) {
            vis._displayData = vis.filtered_data.filter(d => {
                return d.Year <= selected_year
            });

            vis._movingData = vis.filtered_data.filter(d => {
                return d.Year == selected_year
            });
            /*
            yearData.forEach((data,i)=>{
                let countryInfo = {
                    "Country": data.Country,
                    "HDI": data.HDI,
                    "CO2": data.CO2,
                    "perCapita": data.perCapita
                }
                vis._movingData[i] = countryInfo;
            }
            )
             */
        }
        else
        {
            vis._displayData = vis.filtered_data;
        }
        vis.selectedMeasure = d3.select("#co2-measure").property("value");

        vis.updateVis();

    }

    updateVis() {
        let vis =this;
        //console.log(vis._displayData)
        yearText.text(selected_year)
        vis.y.domain([0,d3.max(vis.data,d=>d[vis.selectedMeasure])])

        if(vis._movingData.length == 0){
            return;
        }

        vis.circles = vis.svg
            .selectAll("circle")
            .data(vis._displayData,d=>d.Country)

        vis.circles.enter()
            .append("circle")
            .attr("class","countries")
            .merge(vis.circles)
            .attr("opacity",d=>{
                if (d.Year == selected_year){
                    return 1;
                }
                return 1;
            })
            .attr("cy",d=>{
                return vis.y(d['pre_'+vis.selectedMeasure]);
            })
            .attr("cx",d=>{
                return vis.x(d.pre_HDI);
            })
            .transition()
            .duration(50)
            .attr("cx",d=>{
                return vis.x(d.HDI);
            })
            .attr("cy",d=>{
                return vis.y(d[vis.selectedMeasure]);
            })
            .attr('r',d=>{
                if (d.Year == selected_year){
                    return 0;
                }
                return 1;
            })
            .attr('fill',d=> {
                return vis.colorPalette(d.Country);
            })
            .attr('stroke','black')


        vis.circles.exit()
            .remove()
        /*
        vis.circles2 = vis.svg
            .selectAll(".country")
            .data(vis._movingData,d=>d.Country)

        vis.circles2.enter()
            .append("circle")
            .attr("class","country")
            .attr('r',10)
            .attr('fill',d=> {
                return vis.colorPalette(d.Country);
            })
            .attr('stroke','black')
            .attr("opacity",1)
            .merge(vis.circles2)
            .transition()
            .duration(100)
            .attr("cy",d=>{
                return vis.y(d[vis.selectedMeasure]);
            })
            .attr("cx",d=>{
                return vis.x(d.HDI);
            })

        */
        vis.countryLabel = vis.svg
            .selectAll(".country-label")
            .data(vis._movingData,d=>d.Country)
        vis.countryLabel.enter()
            .append("text")
            .attr("class","country-label")
            .merge(vis.countryLabel)
            .attr("x", d=>(vis.x(d.HDI) - 10))
            .attr("y", d=>{
                return (vis.y(d[vis.selectedMeasure]) - 10)
            })
            .text(d=>d.Country)

        // vis.circles2.exit()
        //     .remove()
        vis.countryLabel.exit()
            .remove()

        vis.icons = vis.svg
            .selectAll(".cicon")
            .data(vis._movingData,d=>d.Country)

        vis.icons.enter()
            .append("image")
            .attr("class","cicon")
            .merge(vis.icons)
            .attr('xlink:href',d=>countryIcons[d.Country])
            .attr("width",20)
            .attr("height",20)
            .attr('x',d=>vis.x(d.HDI)-10)
            .attr('y',d=>vis.y(d[vis.selectedMeasure])-10)

        vis.icons.exit().remove()


        vis.path1 = vis.svg
            .selectAll(".path-line1")
            .data(vis._displayData,d=>d.Country)
        vis.path1.enter()
            .append("line")
            .attr("class","path-line1")
            .merge(vis.path1)
            .attr("x1", d=>(vis.x(d.pre_HDI)))
            .attr("y1", d=>(vis.y(d["pre_"+vis.selectedMeasure])))
            .attr("x2", d=>(vis.x(d.HDI)))
            .attr("y2", d=>(vis.y(d[vis.selectedMeasure])))
            .attr("stroke",d=>{
                return vis.colorPalette(d.Country);
            })
        vis.path1.exit()
            .remove();

        vis.path = vis.svg
            .selectAll(".path-line")
            .data(vis._movingData,d=>d.Country)
        vis.path.enter()
            .append("line")
            .attr("class","path-line")
            .merge(vis.path)
            .attr("x1", d=>(vis.x(d.pre_HDI)))
            .attr("y1", d=>(vis.y(d["pre_"+vis.selectedMeasure])))
            .attr("x2", d=>(vis.x(d.pre_HDI)))
            .attr("y2", d=>(vis.y(d["pre_"+vis.selectedMeasure])))
            .attr("stroke",d=>{
                return vis.colorPalette(d.Country);
            })
            .transition()
            .duration(50)
            .attr("x2", d=>(vis.x(d.HDI)))
            .attr("y2", d=>(vis.y(d[vis.selectedMeasure])))

        vis.path.exit()
            .remove();


        if(vis.selectedMeasure == "CO2"){
            vis.yLabel.text("Absolute CO2 emissions");
            vis.svg.select(".y-axis").call(vis.yAxis.tickFormat(d => d3.format(".2s")(d).replace("G","B")));
        }
        else{
            vis.yLabel.text("CO2 emissions (in tonnes) per capita");
            vis.svg.select(".y-axis").call(vis.yAxis);
        }
        vis.xLabel.text("Human Development Index")

        vis.svg.select(".x-axis").call(vis.xAxis);
/*
        vis.dynamic_text = vis.svg_text.selectAll(".dynamic_text")
            .data(countryData)
        vis.dynamic_text.enter()
            .append("text")
            .merge(vis.dynamic_text)
            .attr("class","dynamic_text")
            .text(d=>d)
            .attr("y",(d,i)=>{
                return i*30 + 15;
            })

        vis.dynamic_text.exit().remove();
       
 */

    }

    getMinYear() {
        let vis = this;
        vis.selectedData = []
        countries.forEach(country=>{
            vis.selectedData = d3.merge([vis.selectedData,vis.data.filter(d=>{
                return d.Country == country
            })])
        })
        return d3.min(vis.selectedData,d=>d.Year)
    }

}