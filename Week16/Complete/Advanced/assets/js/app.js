// define the width and height of the svg based on size of the container
var width = 960//parseInt(d3.select("#scatter").style("width"));
var height = 500//width - width/3.9;
//define margin
var margin = 20;
// define padding
var labelArea = 110;
var paddingBottom = 40;
var paddingLeft = 40;

// Create svg area
var svg = d3
            .select("#scatter")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
            .attr("class","chart");

// Define circle radius based on svg size
var circleRadius;

function circleGet() {
  if (width <= 530) {
    circleRadius = 5;
  }else{
    circleRadius = 10;
  }
}

circleGet();

// Labels x axis

svg.append("g").attr("class","xText");

var xText = d3.select(".xText");

// give xText a transform property
function xTextRefresh() {
  xText.attr("transform","translate(" +
      ((width - labelArea)/2 + labelArea) + 
      ", " + 
      (height - margin - paddingBottom)+
    ")");
}

xTextRefresh();

// append 3 labels to xText

xText.append("text")
    .attr("y",-26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)");

xText.append("text")
    .attr("y",-0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");

xText.append("text")
    .attr("y",26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");


// Labels y axis
var leftTextX = margin + paddingLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class","yText")

var yText = d3.select(".yText");

// give yText a transform property
function yTextRefresh() {
  yText.attr("transform","translate(" +
      leftTextX + 
      ", " + 
      leftTextY+
    ")rotate(-90)");
}

yTextRefresh();

// append 3 labels to xText

yText.append("text")
    .attr("y",-26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obesity (%)");

yText.append("text")
    .attr("y",0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

yText.append("text")
    .attr("y",26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Healthcare (%)");


d3.csv("data\\data.csv", function(err, data) {
  visualize(data);
});

// create visualization function
// purpose of function is to manipulate all the visual elements
function visualize(theData) {
  var curX = "poverty";
  var curY = "obesity";

  // variables to store the max and min values
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  //create tooltips
  var toolTip = d3.tip()
                  .attr("class","d3-tip")
                  .offset([40,-60])
                  .html( d => {
                    var theX;
                    // get state name
                    var theState = "<div>" + d.state + "</div>";
                    // get y value's key and value
                    var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
                    // if x key is poverty
                    if(curX === "poverty") {
                      // get the x key and value
                      theX = "<div>" + curX + ": " + d[curX] + "%</div>";
                    }else{
                      theX = "<div>" + curX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
                    }
                    // display what we captured
                    return theState + theX + theY;
                  });
  svg.call(toolTip);

  // create a function to find the max and min values of data
  function xMinMax() {
    xMin = d3.min(theData, d => {
      return parseFloat(d[curX]) * 0.90;
    });
    xMax = d3.max(theData, d => {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  function yMinMax() {
    yMin = d3.min(theData, d => {
      return parseFloat(d[curY]) * 0.90;
    });
    yMax = d3.max(theData, d => {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // change classes and appearance when a different lable text is clicked
  function labelChange(axis, clickText) {
    // switch class active / inactive
    d3.selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    
    // switch the text clicked to active
    clickText.classed("inactive", false).classed("active",true);
  }
  //scatter plot
  xMinMax();
  yMinMax();

  var xScale = d3
                .scaleLinear()
                .domain([xMin,xMax])
                .range([margin + labelArea, width - margin]);
  var yScale = d3
                .scaleLinear()
                .domain([yMin,yMax])
                .range([height - margin -labelArea, margin]);
  
  // pass the scales into the axis methods to create the axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }else{
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();
  
  // append axis to the svg as group elements
  svg.append("g")
     .call(xAxis)
     .attr("class","xAxis")
     .attr("transform","translate(0, " +(height - margin - labelArea) +")");

  svg.append("g")
     .call(yAxis)
     .attr("class","yAxis")
     .attr("transform","translate(" +(margin + labelArea) +", 0)");


  // append the circles for each row of data
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();
  console.log("Scales: ",xScale(theData[curX]),xScale(theData[curY]));
  theCircles.append("circle")
            .attr("cx", d => {return xScale(d[curX])})
            .attr("cy", d => {return yScale(d[curY])})
            .attr("r",circleRadius)
            .attr("class",d => {
              return "stateCircle " + d.abbr;
            })
            .on("mouseover",function(d) {
              toolTip.show(d, this);
              // highlight the state circle's border
              d3.select(this).style("stroke","#323232");
            })
            .on("mouseout",function(d) {
              toolTip.hide(d);
              d3.select(this).style("stroke","#e3e3e3")
            });

            theCircles.append("text")
            .text(d => {
              return d.abbr;
            })
            .attr("dx", d => {
              return xScale(d[curX]);
            })
            .attr("dy", d=> {
              // when size of the text is the radius
              // add a third of the radius to the height
              // pushes it to the middle of the circle
              return yScale(d[curY]) + circleRadius / 2.5;
            })
            .attr("font-size", circleRadius)
            .attr("class", "stateText")
            .on("mouseover", d => {
              toolTip.show(d);
              d3.select("." + d.abbr).style("stroke","#323232")
            })
            .on("mouseout", d => {
              toolTip.hide(d);
              d3.select("." + d.abbr).style("stroke","#e3e3e3")
            })

        // make the graph dynamic
        d3.selectAll(".aText").on("click", function() {
          var self = d3.select(this)

          // we only want to select inactive labels
          if (self.classed("inactive")) {
            // get the name and axis saved in the label
            var axis = self.attr("data-axis")
            var name = self.attr("data-name")

            if (axis === "x") {
              curX = name;
              //change the min and mas
              xMinMax();
              //update the domain of x
              xScale.domain([xMin,xMax]);

              svg.select(".xAxis").transition().duration(300).call(xAxis);

              // with the axis changed, change the location of circles
              d3.selectAll("circle").each(function() {
                d3.select(this)
                  .transition()
                  .attr("cx",function(d) {
                    return xScale(d[curX]);
                  })
                  .duration(300);
              });
              d3.selectAll(".stateText").each(function() {
                d3.select(this)
                  .transition()
                  .attr("dx",function(d) {
                    return xScale(d[curX]);
                  })
                  .duration(300);
              }); 

              //change the classes of the active and the clicked label
              labelChange(axis, self);
            }else{
              //when y is clicked
              curY = name;
              //change the min and mas
              yMinMax();
              //update the domain of y
              yScale.domain([yMin,yMax]);

              svg.select(".yAxis").transition().duration(300).call(yAxis);

              // with teh axis changed, change the location of circles
              d3.selectAll("circle").each(function() {
                d3.select(this)
                  .transition()
                  .attr("cy",function(d) {
                    return yScale(d[curY]);
                  })
                  .duration(300);
              })
              d3.selectAll(".stateText").each(function() {
                d3.select(this)
                  .transition()
                  .attr("dy",function(d) {
                    return yScale(d[curY]) + circleRadius/3;
                  })
                  .duration(300);
              })

              //change the classes of the active and the clicked label
              labelChange(axis, self);
            }
          }
        });

}
