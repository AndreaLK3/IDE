         
    function init1() {

//Modified version of the tree data, to work with the first, simpler visualization
        var data = {
  "name": "Donald Trump",
        "children": [
        {
          "name": "Donald Trump Jr.",
              "children": [
                {
                  "name": "Kai Madison"
                },
                {
                  "name": "Donald III"
                },
                {
                  "name": "Chloe Sophia"
                },
                {
                  "name": "Tristan Milos"
                },
                {
                  "name": "Spencer Frederick"
                }
              ]
        },
        {
          "name": "Ivanka Trump",
                "children": [
                {
                  "name": "Arabella Rose"
                },
                {
                  "name": "Joseph Frederick"
                },
                {
                  "name": "Theodore James"
                }
              ]
        },          
        {
          "name": "Eric Trump",
        },          
    
        {
          "name": "Tiffany Trump"
        },
        {
          "name": "Baron Trump"
        }
  ]
 };
   
        var margin = {top: 40, right: 90, bottom: 50, left: 90};
        var clientWidth = window.screen.width;
        w = clientWidth - margin.left - margin.right,
        h =  400 - margin.top - margin.bottom;


        var canvas = d3.select("#treeArea")
                    .attr("width", w + margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        canvas.attr('transform','translate('+ clientWidth/2 +' , '+(h/3) +')');

        //layout type picked is tree
        var tree = d3.tree()
                    .nodeSize([110, 120]);

        // Assigns parent
        var nodes = d3.hierarchy(data);

        // Assigns the x and y position for the nodes
        nodes = tree(nodes);

        // adds the links between the nodes
        var link = canvas.selectAll(".link")
                        .data(nodes.descendants().slice(1))
                        .enter()
                        .append("path")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            return "M" + d.x + "," + d.y
                            + "C" + d.x + "," + (d.y + d.parent.y) / 2
                            + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                            + " " + d.parent.x + "," + d.parent.y;
                        })
                        .attr('fill', 'none')
                        .attr('stroke', '#ccc')
                        .attr('stroke-width', 2);

        // adds each node as a group
        var node = canvas.selectAll('.node')
                        .data(nodes.descendants())
                        .enter()
                        .append('g')
                        .attr('class', function(d) {
                            return "node" +
                                    (d.children ? " node--internal" : " node--leaf"); })
                        .attr("transform", function(d) { return "translate( " + d.x + "," + d.y + ")" })
                        .attr("y", function(d) { return d.depth * 180;})

        // adds the circle to the node
        node.append('circle')
            .attr('r', 30)
            .attr('fill', 'steelblue');

        // adds the text to the node
        node.append("text")
            .attr("dy", 1)
            .attr("y", (d) => d.children ? 0 : 0 )
            .attr("x", (d) => d.children ? -5 : -35)
            .attr("width", 30)
            .style("font-size", 12)
            .style("font-weight", 'bold')
            .style("text-anchor", (d) =>  d.children ? "end" : "start" )
            .text(function(d) { return d.data.name});
    

}
        