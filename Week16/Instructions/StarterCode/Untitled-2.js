// @TODO: YOUR CODE HERE!


d3.csv("./assets/data/data.csv", function(error, djData) {
   
    if (error) return console.warn(error);

    djData.forEach(function(data) {
      data.poverty = parseFloat(data.poverty);
      data.healthcare = parseFloat(data.healthcare);
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.income = +data.income;
    });

function autochange(datasource,key1,key2,y,x) {
var svgHeight = 550;
var svgWidth = 900;

var margin = {
    top: 20,
    right: 40,
    bottom: 125,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#scatter")
  .html("")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

 // Append a group to the SVG area and shift ('translate') it to the right and to the bottom 
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    console.log(d3.min(djData, d=> d.healthcare));
  var xBandScale = d3.scaleLinear()
    .domain(d3.extent(datasource, d=> d[key1]))
    .range([0, width]);
   
 var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(datasource, d=> d[key2]))
    .range([height,0]);

var bottomAxis = d3.axisBottom(xBandScale);
var leftAxis = d3.axisLeft(yLinearScale);

//set X and Y Axis
chartGroup.append("g")
  .transition()
  .duration(y)
  .call(leftAxis);

chartGroup.append('g')
 .attr('transform', `translate(0, ${height})`)
 .transition()
 .duration(x)
 .call(bottomAxis);

//Print scatter (circle) corresponding with values(location)
var circlesGroup = chartGroup.selectAll("circle").data(datasource);
var g = circlesGroup.enter().append("g")
g.append("circle")
.attr("cx", d => xBandScale(+d[key1]))
.attr("cy", d => yLinearScale(+d[key2]))
.attr("r", "12")
.attr("fill", "lightblue")
.attr("stroke-width", "1")
.attr("stroke", "black")
//add text inside Cirle using State info
g.append('text')
.attr('x', d => xBandScale(+d[key1]))
.attr('y',d => yLinearScale(+d[key2]))
.attr('dx',-9)
.attr('dy',5)
.style("font-size", "11px")
.style("font-weight", "bold")
.text(d=>d.abbr);

//add tooltip

var toolTip = d3.select("body").append("div")
.style('display', 'none')
.style('opacity', 0.7)
.classed('tooltip', true);

//Add an onmouseover event to display a tooltip
var check = g.selectAll("circle,text");
   
check.on("mouseover", function(d, i) {
 if (key1==="income" || key1 === "age") {
  toolTip
  .html(`${d.state}<br>${key1.charAt(0).toUpperCase() + key1.substr(1)}: ${d[key1]}<br>${key2.charAt(0).toUpperCase() + key2.substr(1)}: ${d[key2]}%`)
  .style('left', d3.event.pageX + 10 + 'px')
  .style('top', d3.event.pageY + 'px')
  .style('display', 'block')
 }
 else {
  toolTip
  .html(`${d.state}<br>${key1.charAt(0).toUpperCase() + key1.substr(1)}: ${d[key1]}%<br>${key2.charAt(0).toUpperCase() + key2.substr(1)}: ${d[key2]}%`)
  .style('left', d3.event.pageX + 10 + 'px')
  .style('top', d3.event.pageY + 'px')
  .style('display', 'block')
 }
})
// Add an onmouseout event to make the tooltip invisible
.on("mouseout", function() {
  toolTip.style("display", "none");
})

 
  // Create axes labels for X
  var axisY1 = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 88)
    .attr("x", 0 - (height / 1.3))
    .attr("dy", "-2em")
    .attr("class", "axisY")
    .attr("value","healthcare")
    .text("Lacks Healthcare (%)");

   var axisY2= chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 68)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "-2em")
    .attr("class", "axisY")
    .attr("value","smokes")
    .text("Smokes (%)");

    var axisY3=chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 48)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "-2em")
    .attr("class", "axisY")
    .attr("value","obesity")
    .text("Obese (%)");
    
    // Conditions if choose this label on X then will generate new data and  other labels will act as CSS define file
    if (key2==="healthcare") {
      axisY1.classed("active",true);
      axisY1.classed("inactive",false);
      axisY2.classed("inactive",true);
      axisY3.classed("inactive",true);
    }
    else if (key2==="smokes") {
      axisY1.classed("inactive",true);
      axisY2.classed("active",true);
      axisY2.classed("inactive",false);
      axisY3.classed("inactive",true);
    }
    else if (key2==="obesity") {
      axisY1.classed("inactive",true);
      axisY2.classed("inactive",true);
      axisY3.classed("active",true);
      axisY3.classed("inactive",false);
    }
   // Create axes labels for Y
  var axisX1 = chartGroup.append("text")
    .attr("transform", `translate(${width/2.2}, ${height + margin.top + 30})`)
    .attr("class", "axisX")
    .attr("value","poverty")
    .text("In Poverty (%)");

   var axisX2 = chartGroup.append("text")
    .attr("transform", `translate(${width/2.2}, ${height + margin.top +50})`)
    .attr("class", "axisX")
    .attr("value","age")
    .text("Age (Median)")

   var axisX3 = chartGroup.append("text")
    .attr("transform", `translate(${width/2.6}, ${height + margin.top +70})`)
    .attr("class", "axisX")
    .attr("value","income")
    .text("Household Income (Median)");
// Conditions if choose this label on X then will generate new data and  other labels will act as CSS define file
    if (key1==="poverty") {
      axisX1.classed("active",true);
      axisX1.classed("inactive",false);
      axisX2.classed("inactive",true);
      axisX3.classed("inactive",true);
    }
    else if (key1==="age") {
      axisX1.classed("inactive",true);
      axisX2.classed("active",true);
      axisX2.classed("inactive",false);
      axisX3.classed("inactive",true);
    }
    else if (key1==="income") {
      axisX1.classed("inactive",true);
      axisX2.classed("inactive",true);
      axisX3.classed("active",true);
      axisX3.classed("inactive",false);
    }

// On click on specify text on X or Y axis then get the value of text, pass these value for recalling the function to generate new data
//do animation on X,Y axis
d3.selectAll("text.axisX").on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  key1=value;
  y=1;
  x=1200;
autochange(djData,key1,key2,y,x);
});

d3.selectAll("text.axisY").on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
key2=value;
y=1200;
x=1;
autochange(djData,key1,key2,y,x);
});
}
// Call a default function on loading page
autochange(djData,"poverty","healthcare");

});
