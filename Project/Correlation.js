function drawScatterplot(variable1, variable2, width, height, data) {

    var padding = 40;

    var svg = d3.select("#scatterPlot_svg")
        .attr("width", width)
        .attr("height", height);


    svg.selectAll(".SPgroup")
        .remove();
    var svg_g = svg.append("g")
        .attr("class", "SPgroup");


    console.log(svg.selectAll("circle"))
    svg.selectAll("circle")
        .remove();

    svg.selectAll(".axis")
        .remove();

    data.forEach(function (d) {
        d[variable2] = +d[variable2];
        d[variable1] = +d[variable1];
    });

    var xValue = function (d) {
        return d[variable1];
    }

    var xScale = d3.scaleLinear().range([0 + padding + (0 + padding / 2) , width - padding]),
        xMap = function (d) {

            return xScale(d[variable1]);
        },
        xAxis = d3.axisBottom().scale(xScale);

    var yValue = function (d) {
            return d[variable2];
        },
        yScale = d3.scaleLinear().range([height - padding, 0 + padding]),
        yMap = function (d) {
            return yScale(d[variable2]);
        },
        yAxis = d3.axisLeft().scale(yScale);

    xScale.domain(d3.extent(data, function (d) {
        return d[variable1]
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d[variable2]
    }));

    svg_g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + (height - padding) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(variable1);

    svg_g.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (1.5 * padding) + ", 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(variable2);

    svg_g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (d) {
            return "blue"
        });

    svg_g.selectAll(".dot")
        .data(data)
        .exit().remove();

    svg_g.selectAll(".dot")
        .attr("aaa", function (d) {
            if (this.getAttribute("cx") == "NaN" || this.getAttribute("cy") == "NaN") {
                d3.select(this).remove()
            }
        })

    svg_g.append("text")
        .attr("transform", "translate(" + (width / 2 + 10 + (padding / 2))+ " ," +
            (height - 1.5 * padding + 50) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "rem")
        .text(variable1);

    svg_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(variable2);
}

function createHistogram(width, height, pickedDimension, allDims, raw_stationdata) {
    var svg_1 = d3.select("#scatterPlot_svg")
    svg_1.selectAll(".SPgroup")
        .remove();
    svg_2.selectAll('*').remove()
    corrs = [];
    allOtherDims = removeFromArrayNoChange(allDims, pickedDimension)

    allOtherDims.forEach(function (otherDim) {
        corrs.push(
            {
                dimension: otherDim,
                correlationValue: computeArrayCorrelation(weatherAndStation_data, pickedDimension, otherDim)
            })
    })

    dimensionNames = corrs.map(function (d) {
        return d.dimension;
    })
    var x = d3.scaleBand()
        .domain(dimensionNames)
        .rangeRound([0 + padding, width - padding]);

    var y = d3.scaleLinear()
        .domain([-1, +1])
        .range([height - padding, 0 + padding]);

    var columnOffset = padding / 2 + 10;

    svg_2.selectAll(".bar")
        .data(corrs.map(function (d) {
            return d.correlationValue;
        }))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) {
            return "" + (columnOffset + x(corrs[i].dimension)) + "";
        })
        .attr("y", function (d) {
            if (d < 0) {
                return y(0)
            }
            else {
                return y(d)
            }
        })
        .attr("fill", function (d) {
            if (d < 0) {
                return "orange"
            }
            else {
                return "lightblue"
            }
        })
        .attr("width", width / dimensionNames.length - 30)
        .attr("height", function (d, i) {
            if(Math.abs(y(d) - y(0)) < 40){
                svg_2.append("rect")
                    .attr("class","invisibleBar")
                    .attr("width",width / dimensionNames.length - 30)
                    .attr("x",
                        "" + (columnOffset + x(corrs[i].dimension)) + ""
                    )
                    .attr("y", function() {
                        if (d < 0) {
                            return y(0)
                        }
                        else {
                            return y(d)
                        }
                    })
                    .attr("fill","transparent")
                    .attr("height",(Math.abs(y(d) - y(0)) + 50))
                    .on('click', function() {
                        console.log("attempt")
                        drawScatterplot(pickedDimension, corrs[i].dimension, width, height, raw_stationdata)})
            }
            return Math.abs(y(d) - y(0))
        })
        .attr("title",function(d){
            return d.toFixed(3);
        })
        .on('click', function (d, i) {
                drawScatterplot(pickedDimension, corrs[i].dimension, width, height, raw_stationdata)
            }
        );


    /** Axis **/
    svg_2.append("g")
        .attr("transform", "translate(" + (0 + padding / 2) + "," + (height / 2) + ")")
        .call(d3.axisBottom(x));

    svg_2.append("g")
        .attr("transform", "translate(" + (1.5 * padding) + ", 0 )")
        .call(d3.axisLeft(y));

    svg_2.append("text")
        .attr("transform", "translate(" + (width / 2 + 10 + (padding / 2))+ " ," +
            (height - 1.5 * padding + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "rem")
        .text("Other Pollutants & Weather Factors");

    svg_2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Correlation Coefficient");
}

function filterArrays(arr1, arr2) {
    var arrayVar1_filtered = [],
        arrayVar2_filtered = [];

    for (var i = 0; i < arr1.length; i++) {
        elem1 = arr1[i]
        elem2 = arr2[i]

        if (Number.isNaN(elem1) || Number.isNaN(elem2)) {
        }
        else {
            arrayVar1_filtered.push(elem1)
            arrayVar2_filtered.push(elem2)
        }
    }
    return [arrayVar1_filtered, arrayVar2_filtered];
}

function getPearsonCorrelation(arr1, arr2, avg1, avg2, std1, std2) {
    var shortestArrayLength = 0;
    if (arr1.length == arr2.length) {
        shortestArrayLength = arr1.length;
    } else if (arr1.length > arr2.length) {
        shortestArrayLength = arr2.length;
        console.log('WARNING : x has more items in it, the last ' + (arr1.length - shortestArrayLength) + ' item(s) will be ignored');
    } else {
        shortestArrayLength = arr1.length;
        console.log('WARNING : y has more items in it, the last ' + (arr2.length - shortestArrayLength) + ' item(s) will be ignored');
    }

    var count = 0,
        sum = 0;
    for (var i = 0; i < shortestArrayLength; i++) {
        var x = arr1[i],
            y = arr2[i];

        var f1 = x - avg1,
            f2 = y - avg2;

        sum = sum + f1 * f2;

        count++;
    }
    var num_avg = sum / count
    return num_avg / (std1 * std2);

}

function computeArrayCorrelation(data, variable1, variable2) {
    var arrayVar1 = [],
        arrayVar2 = [];

    data.forEach(function (d) {
        arrayVar1.push(parseFloat(d[variable1]));
        arrayVar2.push(parseFloat(d[variable2]));
    })

    filtered_arrays = filterArrays(arrayVar1, arrayVar2)
    arrayVar1_filtered = filtered_arrays[0]
    arrayVar2_filtered = filtered_arrays[1]

    var stdVar1 = math.std(arrayVar1_filtered);
    var stdVar2 = math.std(arrayVar2_filtered);

    var avg1 = math.mean(arrayVar1_filtered),
        avg2 = math.mean(arrayVar2_filtered);

    return getPearsonCorrelation(arrayVar1_filtered, arrayVar2_filtered, avg1, avg2, stdVar1, stdVar2);

}


