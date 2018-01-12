function drawScatterplot(variable1, variable2, width, height, data){

    var padding = 40;

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    // change string (from CSV) into number format
    data.forEach(function (d) {
        //console.log(d[variable2]);
        d[variable2] = +d[variable2];
        d[variable1] = +d[variable1];
        //console.log(d);
    });

    // setup x
    var xValue = function (d) {return d[variable1];} // data -> value
    console.log("Width: " + width)
    console.log(0 + padding)
    console.log( width - padding)
    var xScale = d3.scaleLinear().range([0 + padding, width - padding]), // value -> display
        xMap = function (d){
            //console.log(xValue(d))
            return xScale(d[variable1]);
        }, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

    // setup y
    var yValue = function (d) {
            return d[variable2];
        }, // data -> value
        yScale = d3.scaleLinear().range([height - padding, 0 + padding]), // value -> display
        yMap = function (d) {
            return yScale(d[variable2]);
        }, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

    //don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain(d3.extent(data, function(d) { return d[variable1]}));
    yScale.domain(d3.extent(data, function(d) { return d[variable2]}));

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(variable1);

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (padding) +  ", 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(variable2);

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return color(cValue(d));
        });

    function ComputeArrayValue()
    // // draw legend
    // var legend = svg.selectAll(".legend")
    //     .data(color.domain())
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    //
    // // draw legend colored rectangles
    // legend.append("rect")
    //     .attr("x", width - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", color);

    // draw legend text
    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) { return d;})
}