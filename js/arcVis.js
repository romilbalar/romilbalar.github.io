

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 30, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
    console.log("Manoj")

    d3.json("data/arcdata.json").then( function(data) {
    console.log(data)

    // List of node names
    var allNodes = data.nodes.map(function(d){return d.cp})

    // List of groups
    var allGroups = data.nodes.map(function(d){return d.group})

    allGroups = [...new Set(allGroups)]

    var allNames = data.nodes.map(function(d){ return d.name})

    allNames = [...new Set(allNames)]

    // A color scale for groups:
    var color = d3.scaleOrdinal()
    .domain(allGroups)
    .range(d3.schemeSet2);

    // A linear scale for node size
    var size = d3.scaleLinear()
    .domain([0.2,0.9])
    .range([1,10]);

    // A linear scale to position the nodes on the X axis
    var x = d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(data.nodes,d=>d.cp))

    var xAxis = d3.axisBottom()
    .scale(x)


    svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + (height-30) + ")")
    .call(xAxis)

    svg.append("g")
    .attr("class","labels x-label")
    .attr("transform", "translate("+(width/2 - 30)+"," + (height+15) + ")")
    .append("text")
    .text("Co2 emission per capita")

    node_hdi = svg.append("g")
        .attr("class","nodeHDI");
    node_hdi_text = node_hdi.append("text")

    var idToNode = {};
    data.nodes.forEach(function (n) {
    idToNode[n.id] = n;
});

    console.log(allNames)

    // Add the links
    var links = svg
    .selectAll('mylinks')
    .data(data.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
    start = x(idToNode[d.source].cp)    // X position of start node on the X axis
    end = x(idToNode[d.target].cp)      // X position of end node
    return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
    'A',                            // This means we're gonna build an elliptical arc
    (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
    (start - end)/2, 0, 0, ',',
    start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
    .join(' ');
})
    .style("fill", "none")
    .attr("stroke", "grey")
    .attr("class",function (d){

    // console.log(d.source.split("_")[0])
    return d.source.split("_")[0].split(" ")[0]+"_arc"
})
    // .attr("class","_arc")
    .style("stroke-width", 1)

    // Add the circle for the nodes
    var nodes = svg
    .selectAll("mynodes")
    // .data(data.nodes.sort(function(a,b) { return +b.n - +a.n }))
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("cx", function(d){ return(x(d.cp))})
    .attr("cy", height-30)
    .attr("r", function(d){ return(size(d.n))})
    .style("fill", function(d){ return color(d.group)})
        // .attr("stroke-width",1.2)
    .attr("stroke", function(d){ if(d.n>=0.9){return "gold";}
                                else {return "white";}});



    data.nodes.map(function (d){
    svg.selectAll("."+d.name.split(" ")[0]+"_arc").attr("stroke",color(d.group))
})

    var groupLabels = svg
    .selectAll("grouplabels")
    .data(allGroups)
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(d){ return allNames[d]} )
    .style("text-anchor", "end")
    .attr("class",function(d){
    return allNames[d].split(" ")[0]+"_label"
})
    .attr("fill",d=> color(d))
    .attr("transform", function(d){ return( "translate(" + (100) + "," + (50+d*25) + ")")})


    groupLabels.on('mouseover', function (e,d) {
    d3.select(this)
    .style('opacity', 1)
    svg.selectAll("." + allNames[d].split(" ")[0] + "_arc")
    .style('stroke-width',4)
    svg.selectAll("." + allNames[d].split(" ")[0] + "_label")
    .style('fill','black')
})
    .on('mouseout', function (e,d) {
    nodes.style('opacity', 1)
    data.nodes.map(function(d) {
    svg.selectAll("." + d.name.split(" ")[0] + "_arc")
    .style('stroke', color(d.group))
    .style('stroke-opacity', .8)
    .style('stroke-width', '1')
})
    svg.selectAll("." + allNames[d].split(" ")[0] + "_label")
    .style('fill',color(d))
})

    nodes
    .on('mouseover', function (e,d) {
    nodes
    .style('opacity', .2)
    d3.select(this)
    .style('opacity', 1)
    svg.selectAll("." + d.name.split(" ")[0] + "_arc")
    .style('stroke-width',4);

    node_hdi.attr("transform", "translate("+(x(d.cp))+"," + (height-5) + ")");

    node_hdi_text.text(d.n)


})
    .on('mouseout', function (e,d) {
    nodes.style('opacity',1)

    data.nodes.map(function(d) {
    svg.selectAll("." + d.name.split(" ")[0] + "_arc")
    .style('stroke', color(d.group))
    .style('stroke-opacity', .8)
    .style('stroke-width', '1');
    node_hdi_text.text("")
})
        svg.selectAll("." + allNames[d].split(" ")[0] + "_label")
            .style('fill',color(d))

})


    var linearSize = d3.scaleLinear().domain([0.2,0.8]).range([1, 10]);

    svg.append("g")
    .attr("class", "legendSize")
    .attr("transform", "translate("+(width-50)+","+50+")")
    .append("text")
    .attr("y",-25)
    .text("HDI")


    var legendSize = d3.legendSize()
    .scale(linearSize)
    .shape('circle')
    .shapePadding(15)
    .labelOffset(20)
    .orient('vertical');

    svg.select(".legendSize")
    .call(legendSize);

})

