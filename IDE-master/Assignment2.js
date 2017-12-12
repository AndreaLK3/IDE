d3.select(window).on('load', init);

function init() {

    var mydata = [[26.6,27.5,27.1,27.2,27.7,26.4,25.4,25.8,26.5,26.4,26.4,26.0],
        [26.6,26.6,27.0,27.4,27.9,26.8,26.2,26.1,26.5,26.8,26.8,27.0],
        [27.5,27.6,28.0,28.5,27.8,27.1,26.6,26.5,26.6,26.5,27.1,26.9],
            [26.7,27.1,27.7,28.5,27.9,26.5,25.5,25.7,26.0,26.0,26.5,26.4]];

    var svg = d3.select('svg');
    var width = parseFloat(svg.node().style.width);
    var height = parseFloat(svg.node().style.height);

    var padding = 30;

    var xScale = d3.scaleLinear()
        .domain([0,
            d3.max(mydata,
                function(d){
                    return d[0];
                })])
        .range([padding,width-padding]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(mydata,
            function(d){
                return d[1];
            }),
            d3.max(mydata,
                function(d){
                    return d[1];
                })])
        .range([height-padding, padding]);

    d3.select("#plotarea")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", "10px")
        .attr("cx", function(d){
            return ""+xScale(d[0])+"px";
        })
        .attr("cy", function(d){
            return ""+yScale(d[1])+"px";
        })

    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(d3.axisBottom(xScale));
    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .call(d3.axisLeft(yScale));

}