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

    function getPearsonCorrelation(arr1, arr2, avg1, avg2, std1, std2) {
        var shortestArrayLength = 0;

        if (x.length == y.length) {
            shortestArrayLength = x.length;
        } else if (x.length > y.length) {
            shortestArrayLength = y.length;
            console.log('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
        } else {
            shortestArrayLength = x.length;
            console.log('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
        }

        var count = 0,
            sum = 0;
        for(var i = 0; i < shortestArrayLength; i++){
            var x = arr1[i],
                y = arr2[i];

            var f1 = x - avg1,
                f2 = y - avg2;

           sum = sum + f1*f2 ;

           count++;
        }
        var num_avg = sum / count

        return num_avg / (std1*std2);

    }

    function ComputeArrayValue(data, variable1, variable2){
        var arrayVar1 = [],
            arrayVar2 = [];
        data.foreach(function(d){
            arrayVar1.push(d[variable1]);
            arrayVar2.push(d[variable2]);
            })
        var stdVar1 = math.std(arrayVar1),
            stdVar2 = math.std(arrayVar2);

        var avg1 = math.mean(arrayVar1),
            avg2 = math.mean(arrayVar2);

        return getPearsonCorrelation(arrayVar1,arrayVar2,avg1,avg2,stdVar1, stdVar2);
        
    }


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