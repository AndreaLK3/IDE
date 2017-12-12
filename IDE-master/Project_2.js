function load_graph() {
    load_graph_1();

};

<script>
// Set the dimensions of the graph

var margin = {top: 20, right: 20, bottom: 70, left: 70},
    width = 1150 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function load_graph_1(){

// Parse date

var parseDate = d3.timeParse("%y").parse;

// Set ranges

var x = d3.scaleTime().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(100);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(100);

// Define the line

var valueline = d3.svg.line()
    .x(function(d) { return x(d.yr); })
    .y(function(d) { if (d.mean !== 999.9) return y(d.mean); else return 0 }); //if there is enough data to calculate the average, load it in the graph. Else, do not.

// Add the svg canvas

var svg = d3.select("#graph_1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Get the data

d3.csv("Temperature_Crete.csv", function (error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d.year = parseTime(d.year);
            d.mean = +d.metANN;
        });

        // Scale the range of the data

        x.domain(d3.extent(data, function(d) { return d.year; }));
        y.domain([0, d3.max(data, function(d) { return d.metANN; })]);

// Add the valueline path

        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

// Add the X axis

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

// Text label for X axis

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .attr("class", "axistext")
            .text("Year");

// Add the Y Axis

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

// Text label for Y axis

        svg.append("text")
            .attr("class", "y")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axistext")
            .text("Average annual temperature (°C)");

            });

    });
</script>
