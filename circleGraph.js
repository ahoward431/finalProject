var data = [11,71,18]
var width = 700
var height = 300
var total = 0
var xScale = d3.scaleLinear()
                .domain([0, data.length + 1])
                .range([100, width-150]);
d3.select("#graph")
  .attr("width", width)
  .attr("height", height)

var circles = d3.select("#graph")
                .selectAll("circle")
                .data(data);
circles.enter()
    .append("circle");
circles.exit();
var circles2 = d3.select("#graph")
                  .selectAll("circle")
circles2.transition()
  .duration(1000)
  .attr("cx", function(item, index) {return xScale(index)})
  .attr("cy", height/2)
  .attr("r", function(data) {return data;})
circles2.on("click", function() {
    if(d3.select(this).attr("class") != "selected")
    {
        d3.select(this).attr("class", "selected")
        total = parseInt(d3.select(this).attr("r")) + total
    }
    else
    {
        d3.select(this).attr("class", "")
        total = total - parseInt(d3.select(this).attr("r"))
    }
    makeBigCircle()
    
})

var makeBigCircle = function() {
    var bigCircle = d3.select("#graph")
                      .selectAll("circle.big")
                      .data([total])
    bigCircle.enter().append("circle").attr("class", "big")
    bigCircle.exit()
    d3.select("#graph")
      .selectAll("circle.big")
      .transition()
      .duration(1000)
      .attr("cx", function(){return xScale(data.length+1)})
      .attr("cy", height/2)
      .attr("r", total)
}