//Vaccinated vs Unvaccinated in 2019 outbreak
var vaccinatedData = [11,71,18] //[vaccinated, unvaccinated, unknown]

//Percentage age groups affected in 2019 outbreak
var ageDataBase = [76, 24] //[under 20 (kids), over 20]
var ageDataFull = [4, 10, 11, 24, 29, 20, 4] //[<6mo, 6-11mo, 12-15mo, 16mo-2yr, 5-19yr, 20-49yr, >=50yr]

//Percentage vaccinated vs cases over time
var years = ["1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"] //Make array of strings from 1996-2018
var cases = [508, 138, 100, 100, 85, 116, 41, 56, 37, 66, 45, 43, 140, 0, 63, 220, 55, 187, 667, 188, 86, 120, 375] //Reported cases by year
var coverage = [91,91,92,92,91,91,91,93,93,92,92,92,92,90,90,92,91,92,92,92,92,92,92] //Percentage of population vaccinated

//Autism Rates among vaccinated and unvaccinated children, and whether they had an older sibling with ASD
var noOlder = [
    { unvac: 0.085251492, vaccinated: 0.068104135 }, //2yr
    { unvac: 0.350112814, vaccinated: 3.000251067 }, //3yr
    { unvac: 0.543614619, vaccinated: 0.495664504 }, //4yr
    { unvac: 0.7239819, vaccinated: 0.837140388 + 0.535463483 } //5yr
]

var asdOlder = [
    { unvac: 1.153846154, vaccinated: 0.50215208 }, //2yr
    { unvac: 3.881278539, vaccinated: 2.606310014 }, //3yr
    { unvac: 6.45994832, vaccinated: 4.292421194 }, //4yr
    { unvac: 8.550185874, vaccinated: 5.902777778 + 3.768844221 } //5yr
]

var clearGraph = function() {
    d3.selectAll("#graph *")
      .remove()
}

var clearExtraButtons= function() {
    d3.selectAll("#extraButtons *")
      .remove()
}

var drawTimeGraph = function(width, height, margins) {
    var xScale = d3.scaleLinear()
                    .domain([0, cases.length - 1])
                    .range([margins.left, width - margins.right])
    var xAxis = d3.axisBottom(xScale)
                .tickValues(d3.range(23))
                .tickFormat(function(d,i) {return years[i]})
    var yScale1 = d3.scaleLinear()
                    .domain([d3.min(cases), d3.max(cases)])
                    .range([height-margins.top, margins.top])
    var yAxis1 = d3.axisLeft(yScale1)
    
    var yScale2 = d3.scaleLinear()
                    .domain([d3.min(coverage), d3.max(coverage)])
                    .range([height-margins.top, margins.top])
    var yAxis2 = d3.axisRight(yScale2).ticks(3)
    
    var graph = d3.select("#graph")
    graph.append("g")
          .attr("transform", "translate(0," + (height - margins.top) + ")")
          .call(xAxis)
    
            
    graph.append("g")
          .attr("transform", "translate(" + margins.left + ",0)")
          .call(yAxis1)
    
    graph.append("g")
          .attr("transform", "translate(" + (width - margins.right) + ",0)")
          .call(yAxis2)
    
    var labels = graph.append("g")
    
    labels.append("text")
          .text("Year")
          .attr("transform", "translate(" + (width/2) +"," + height + ")")
    labels.append("g")
            .attr("transform", "translate(20," + (height/2) +")")
            .append("text")
            .text("Cases")
            .attr("transform", "rotate(270)")
    labels.append("g")
            .attr("transform", "translate(580, 50)")
            .append("text")
            .text("Percentage Vaccinated")
            .attr("transform", "rotate(90)")
    
    var legend = graph.append("g")
                      .attr("transform", "translate(60, 50)")
    legend.append("rect")
            .attr("width", "10")
            .attr("height", "10")
            .attr("fill", "yellow")
        
    legend.append("text")
            .text("Percentage Vaccinated")
            .attr("transform", "translate(15, 10)")
    
    legend.append("rect")
            .attr("width", "10")
            .attr("height", "10")
            .attr("fill", "blue")
            .attr("transform", "translate(0, 15)")
        
    legend.append("text")
            .text("Cases")
            .attr("transform", "translate(15, 25)")
            
          
    
    
    var line1 = d3.line()
                    .x(function(d, i) {return xScale(i)})
                    .y(function(d) {return yScale1(d)})
    var line2 = d3.line()
                    .x(function(d, i) {return xScale(i)})
                    .y(function(d) {return yScale2(d)})
    graph.append("path")
         .datum(cases)
         .attr("fill", "none")
         .attr("stroke", "blue")
         .attr("d", line1)
    
    graph.append("path")
         .datum(coverage)
         .attr("fill", "none")
         .attr("stroke", "yellow")
         .attr("d", line2)
    
}

var createAxes = function(xScale, yScale, width, height, margins) {
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    var graph = d3.select("#graph")
    graph.append("g")
          .attr("transform", "translate(" + margins.left + "," + (height - margins.top +10) + ")")
          .call(xAxis)
    
            
    graph.append("g")
          .attr("transform", "translate(" + margins.left + "," + 10 +")")
          .call(yAxis)
}

var createLabels = function(width, height, margins, xText, yText) {
    var graph = d3.select("#graph")
    var labels = graph.append("g")
    
    labels.append("text")
          .text(xText)
          .attr("transform", "translate(" + (width/2) + "," + (height + margins.top) + ")")
    
    labels.append("g")
          .attr("transform", "translate(20," + (height - 50) + ")")
          .append("text")
          .text(yText)
          .attr("transform", "rotate(270)")
}

var drawVaccinatedBar = function(width, height, margins) {
    var xScale = d3.scaleBand()
                    .domain(["Vaccinated", "Unvaccinated", "Unknown"])
                    .range([0, width])
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height-margins.top, 0])
    createAxes(xScale, yScale, width, height, margins)
    createLabels(width, height, margins, "Vaccination Status", "Percentage Infected")
    
    var graph = d3.select("#graph")
    
    graph.selectAll("rect")
         .data(vaccinatedData)
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
            var key = ["Vaccinated", "Unvaccinated", "Unknown"]
            return xScale(key[i]) + margins.left
         })
         .attr("y", function(d) {return (height - margins.top + 10) - yScale(100-d)})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) {
            return yScale(100-d)
         })
         .attr("fill", "green")
         
         
}

var drawAgeBar = function(width, height, margins) {
    var xScale = d3.scaleBand()
                    .domain(["Kids", "Adults"])
                    .range([0, width])
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height-margins.top, 0])
    createAxes(xScale, yScale, width, height, margins)
    createLabels(width, height, margins, "Age Groups", "Percentage Infected")
    
    var graph = d3.select("#graph")
    graph.selectAll("rect")
         .data(ageDataBase)
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
            var key = ["Kids", "Adults"]
            return xScale(key[i]) + margins.left
         })
         .attr("y", function(d) {return (height - margins.top + 10) - yScale(100-d)})
         .attr("width", xScale.bandwidth() - 10)
         .attr("height", function(d) {
            return yScale(100-d)
         })
         .attr("fill", "green")
         
    
}

var drawPie = function() {
    var pie = d3.pie()
    var arc = d3.arc().innerRadius(0).outerRadius(150)
    var colors = ["blue", "yellow", "red", "green", "grey", "cyan", "beige"]
    var labels = ["<6mo", "6-11mo", "12-15mo", "16mo-2yr", "5-19yr", "20-49yr", ">=50yr"]
    
    var graph = d3.select("#graph")
    var arcs = graph.selectAll("g.arc")
                    .data(pie(ageDataFull))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(350, 150)")
    arcs.append("path")
        .attr("fill", function(d, i) {
            return colors[i]
        })
        .attr("d", arc)
    arcs.append("text")    
        .attr("transform", function(d) {         
            return "translate(" + arc.centroid(d) + ")";    
        })    
        .attr("text-anchor", "middle")
        .text(function(d, i) {
            
            return d.value + "%";
        })
    var legend = graph.append("g")
                      .attr("transform", "translate(60, 50)")
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[0])
        
    legend.append("text")
            .text(labels[0])
            .attr("transform", "translate(25, 15)")
    
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[1])
            .attr("transform", "translate(0, 20)")
        
    legend.append("text")
            .text(labels[1])
            .attr("transform", "translate(25, 35)")
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[2])
            .attr("transform", "translate(0, 40)")
        
    legend.append("text")
            .text(labels[2])
            .attr("transform", "translate(25, 55)")
    
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[3])
            .attr("transform", "translate(0, 60)")
        
    legend.append("text")
            .text(labels[3])
            .attr("transform", "translate(25, 75)")
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[4])
            .attr("transform", "translate(0, 80)")
        
    legend.append("text")
            .text(labels[4])
            .attr("transform", "translate(25, 95)")
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[5])
            .attr("transform", "translate(0, 100)")
        
    legend.append("text")
            .text(labels[5])
            .attr("transform", "translate(25, 115)")
    
    legend.append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("fill", colors[6])
            .attr("transform", "translate(0, 120)")
        
    legend.append("text")
            .text(labels[6])
            .attr("transform", "translate(25, 135)")
    
}

var drawAutismGraph = function(width, height, margins, data) {
    var stack = d3.stack().keys(["unvac", "vaccinated"])
    var series = stack(data)
    
    var xScale = d3.scaleBand()
                    .domain(["2yr", "3yr", "4yr", "5yr"])
                    .range([0, width])
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height-margins.top, 0])
    createAxes(xScale, yScale, width, height, margins)
    createLabels(width, height, margins, "Age Group", "Percentage with ASD")
    
    var graph = d3.select("#graph")
    
    var groups = graph.selectAll("g.bar")
                        .data(series)    
                        .enter()    
                        .append("g")
                        .attr("class", "bar")
                        .style("fill", function(d, i) {    
                            var colors = ["blue", "orange"]
                            return colors[i]    
                        })
    var rects = groups.selectAll("rect")
                        .data(function(d) {
                            return d; 
                        })    
                        .enter()    
                        .append("rect")    
                        .attr("x", function(d, i) {
                            var labels = ["2yr", "3yr", "4yr", "5yr"]
                            return xScale(labels[i]) + margins.left
                        })    
                        .attr("y", function(d) {
                            return yScale(d[1])
                        })
                        .attr("height", function(d) {
                            return yScale(d[0]) - yScale(d[1])
                        })
                        .attr("width", xScale.bandwidth())
                        .attr("transform", "translate(0,10)")
    
    var legend = graph.append("g")
                      .attr("transform", "translate(60, 50)")
    legend.append("rect")
            .attr("width", "10")
            .attr("height", "10")
            .attr("fill", "blue")
        
    legend.append("text")
            .text("Unvaccinated")
            .attr("transform", "translate(15, 10)")
    
    legend.append("rect")
            .attr("width", "10")
            .attr("height", "10")
            .attr("fill", "orange")
            .attr("transform", "translate(0, 15)")
        
    legend.append("text")
            .text("Vaccinated")
            .attr("transform", "translate(15, 25)")
    
}



var width = 700
var height = 300
var margins = {left: 50, right: 50, top: 30, bottom: 50}

d3.select("#graph")
  .attr("width", width)
  .attr("height", height)

width = width-margins.left-margins.right
height = height - margins.top - margins.bottom

var buttons = d3.select("#buttons")

buttons.append("button")
        .text("Measles Cases Over Time")
        .on("click", function() {
            clearGraph()
            clearExtraButtons()
            drawTimeGraph(width, height, margins)
        })
buttons.append("button")
        .text("Age Groups Affected")
        .on("click", function() {
            clearGraph()
            clearExtraButtons()
            drawAgeBar(width, height, margins)
            d3.select("#extraButtons")
                .append("button")
                .text("Bar Graph")
                .on("click", function() {
                    clearGraph()
                    drawAgeBar(width, height, margins)
                })
            d3.select("#extraButtons")
                .append("button")
                .text("Pie Chart")
                .on("click", function() {
                    clearGraph()
                    drawPie()
                })
        })
buttons.append("button")
        .text("Vaccinated vs Unvaccinated")
        .on("click", function() {
            clearGraph()
            clearExtraButtons()
            drawVaccinatedBar(width, height, margins)
        })
buttons.append("button")
        .text("Autism Rates")
        .on("click", function() {
            clearGraph()
            clearExtraButtons()
            drawAutismGraph(width, height, margins, asdOlder)
            d3.select("#extraButtons")
                .append("button")
                .text("Older Sibling With ASD")
                .on("click", function() {
                    clearGraph()
                    drawAutismGraph(width, height, margins, asdOlder)
                })
            d3.select("#extraButtons")
                .append("button")
                .text("No Older Sibling with ASD")
                .on("click", function() {
                    clearGraph()
                    drawAutismGraph(width, height, margins, noOlder)
                })
        })
        

