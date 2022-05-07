

// Load CSV file
d3.csv("data/seayear.csv", d => {
	const parseTime = d3.timeParse('%Y');
	d.Date = parseTime(d.Date);
	d.Mean =+ d.Mean;
	return d;
}).then( data => {
	var margin = {top: 30, right: 130, bottom: 30, left: 50};
	// SVG Size
	let width = 700 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// Analyze the dataset in the web console

	console.log("Date "+ JSON.stringify(data[0]));
	var svg= d3.select("#chart-area").append("svg")
		.attr("width",width + margin.left + margin.right)
		.attr("height",height+ margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleTime()
		.domain([d3.min(data, d=>{
			return d.Date;
		}) , d3.max(data, d =>{
			return d.Date;
		})])
		.range([0, width]);
	var y = d3.scaleLinear()
		.domain([d3.min(data, d =>{
			return d.Mean;
		}) , d3.max(data, d =>{
			return d.Mean;
		})])
		.range([height, 0]);
	console.log("Scale test "+y(data[2].Mean)+"---"+ x(data[2].Date));
	/*const area = d3.area()
		.x(d => x(d.Date))
		.y1(d => y(d.Mean))
		.y0(height);*/

	var area = function(datum, boolean) {
		return d3.area()
			.y0(height)
			.y1(function (d) { return boolean? y(d.Mean): 0; })
			.x(function (d) { return x(d.Date)   })
			(datum);
	}


	svg.append("path")
		.data([data])
		.attr("class", "area")
		.attr("d", d => area(d, false))
		.attr("fill", "skyblue")
		.transition()
		.duration(3000)
		.attr("d", d => area(d,true));


	var xAxis = d3.axisBottom()
		.scale(x)
		.tickFormat(d3.timeFormat("%Y"));
	var yAxis = d3.axisLeft()
		.scale(y);

	svg.append("g")
		.attr("class","axis x-axis")
		.attr("transform", "translate(0," + (height) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class","axis y-axis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis);

	svg.append("g")
		.append("text")
		.attr("class", "labels")
		.attr("text-anchor", "end")
		.attr("x", width- 10)
		.attr("y", height -10 )
		.text("Year");

	svg.append("text")
		.attr("x", 0)
		.attr("class", "labels")
		.attr("text-anchor", "end")
		.attr("y", 20)
		.text("Global Sea level Mean")
		.attr("transform","rotate(-90)");

	var g = svg.append("g")
		.attr("class","tooltip_class");

	g.append("line")
		.style("stroke", "black")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height);

	var text1 = g.append("text")
		.attr("x", 10)
		.attr("y", 0 )
		.style("font-size", '12px')

	var text2 = g.append("text")
		.attr("x", 10)
		.attr("y", 20 )
		.style("font-size", '14px')


	const mouseover = (event, d) => {
		//g.style("opacity", 0);
		g.style("display", null);
	};

	const mouseout = (event, d) => {
		g.style("display", "none");
	};


	let bisectDate = d3.bisector(d=>d.Date).left;


	const mousemove = (event, d) => {
		/*const text = d3.select('.tooltip-area__text');
		text.text(`Sales were ${d.sales} in ${d.year}`);
		const [x, y] = d3.pointer(event); */

		let xpos = d3.pointer(event)[0];
		g.attr("transform", "translate("+ xpos+" , 0)");
		var index = bisectDate(data, x.invert(xpos));
		const formatTime = d3.timeFormat("%Y");
		text2.text('Sea level: '+data[index].Mean);
		text1.text(formatTime(data[index].Date));

	};



	svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("opacity", 0)
		.attr("fill", "black")
		.on("mousemove", mousemove)
		.on("mouseout", mouseout)
		.on("mouseover", mouseover);


})
