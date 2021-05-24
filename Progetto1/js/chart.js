

var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins

var myData; // saves the data points to be globally visible


var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// Initialize the ranges of the scale
var yScale = d3.scaleLinear().range([height, 0]);
var xScale = d3.scaleLinear().range([0, width]);
var zScale = d3.scaleLinear().range([0, 25]);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     
    .attr("height", height + margin.top + margin.bottom)   
    .append("g")                                        
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   


// Initialize the axes
var xAxis = d3.axisBottom(xScale) 	// Bottom = ticks below
var yAxis = d3.axisLeft(yScale).ticks(10);   // Left = ticks on the left 

//Function to update the scale domains

function updateXScaleDomain() {
	data = myData; 
    xScale.domain([0, d3.max(data, function(d) { return d.x; }) + 100]);
}

function updateYScaleDomain(){
	data = myData; 
    yScale.domain([0, d3.max(data, function(d) { return d.y; }) + 100]);
}

function updateZScaleDomain(){
	data = myData; 
    zScale.domain([0, d3.max(data, function(d) { return d.z; })]);
}

// Modify Xs data with the current Zs

function modifyDataX(){
	data = myData; 
	data.forEach( function(d) { 
		var currentX = d.x; 
		d.x = d.z; 
		d.z = currentX; 
   });
}

// Modify Ys data with the current Zs

function modifyDataY(){
	data = myData; 
	data.forEach( function(d) { 
		var currentY = d.y; 
		d.y = d.z; 
		d.z = currentY; 
   });
}

// A function to draw the axes

function drawAxes(){

    // draw the x-axis
    svg.append("g")
        .attr("transform",  "translate(0," + height + ")") 
        .attr("class", "x axis")
        .call(xAxis);


    // draw the y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

// It draws the bubbles in the chart 

function updateDrawing(){
	data = myData; 
	var circles = svg.selectAll("circle").data(data); 
    circles.exit().remove(); 

    circles.enter()       	
			.append("circle")
			.attr("cx", function(d) { return xScale(d.x); })
			.attr("cy", function(d) { return yScale(d.y); })
			.attr("r",   function(d) { return zScale(d.z);})
			.attr("fill", "red")
			.attr("fill", function(d){  return d3.rgb(d.x,d.y,d.z) })
			.attr("stroke-width", "2")
			.attr("stroke", "blue");	

	circles.transition().duration(1000)
	        .attr("cx", function(d) { return xScale(d.x); })
			.attr("cy", function(d) { return yScale(d.y); })
			.attr("r",   function(d) { return zScale(d.z);})
			.attr("fill", "red")
			.attr("fill", function(d){  return d3.rgb(d.x,d.y,d.z) })
			.attr("stroke-width", "2")
			.attr("stroke", "blue");
}



function updateAxes(){
    svg.select(".y.axis").transition().duration(1000).call(yAxis);
    svg.select(".x.axis").transition().duration(1000).call(xAxis);
}

// Updates scale domains

function updateDomains(){
	updateYScaleDomain();
	updateXScaleDomain();
    updateZScaleDomain(); 
}

// handles event on Y axis click

function eventOnYAxis(){
	modifyDataY(); 
    updateDomains(); 
    updateAxes(); 
    updateDrawing();
}

// handles event on X axis click

function eventOnXAxis(){
	modifyDataX(); 
    updateDomains(); 
    updateAxes(); 
    updateDrawing();
}

// add an event listener on Y axis click

function addClickEventYAxis(){
	y = svg.select(".y.axis");

	y.on("click", function(d){
		eventOnYAxis(); 
	});
}

// add an event listener on X axis click

function addClickEventXAxis(){
	x = svg.select(".x.axis");

	x.on("click", function(d){
		eventOnXAxis(); 
	});
}

// Load json data and draws the bubble chart

d3.json("data/data.json")
	.then(function(data) {
		myData = data; 
		updateDomains(); 
		drawAxes();
        updateDrawing(); 
        addClickEventYAxis(); 
        addClickEventXAxis(); 
    })
    .catch(function(error) {
		console.log(error); // Some error handling here
  	});

 
