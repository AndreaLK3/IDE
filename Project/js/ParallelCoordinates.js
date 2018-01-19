///////// Updates the list of weather dimensions, depending on the modifications made on a checkbox button        
    function examineCheckbox(thisCheckbox, variableName, dimensions){
                var v_index = dimensions.indexOf(variableName) 
                if (thisCheckbox.checked == true){
                    if (v_index == -1){
                    dimensions.push(variableName)
                    }
                }
                else {
                    if (v_index != -1){
                        dimensions.splice(v_index, 1)
                    }
                }
                //console.log(dimensions)
            }
        

///////// Creates and/or updates the graph of parallel coordinates, given a list of dimensions
function updatePC(width, height, pcSvg, dataset, entire_dataset, dimensions) {
    
    //console.log("Dimensions:" + dimensions)
    
    var padding = 40

    // Create a scale for each dimension.
    var xScale = d3.scaleOrdinal()
    xScale.domain(dimensions); 
    var interColumnSpace =  width / ( (dimensions.length - 1) ) - (5 / dimensions.length )*padding
    
    //console.log(interColumnSpace)
    xScale.range(pRange(0 + padding, width + interColumnSpace - padding, interColumnSpace) );

    var yScales = {}
    dimensions.map(function (dim) { 
                        yScales[dim] = d3.scaleLinear().range([height - padding,0])
                                        .domain( getExtentOfProperty(entire_dataset, dim) ); 
                                  return undefined;})
    ///////// Line generator
    var line = d3.line()

    
    
  // DATA JOIN
  // Join new data with old elements, if any.
  //var text = g.selectAll("text")
  //   .data(data);
    var gDims = pcSvg.selectAll(".dimension")
                 .data(dimensions, function(d) {return d})
    
    //console.log(gDims)

  // EXIT
  // Remove old elements as needed.
  gDims.exit().remove();

  // ENTER + UPDATE

    var newDimensions = gDims.enter()
         .append("g")
         .attr("class", "dimension")
    
    var allDimensions = newDimensions.merge(gDims)
         .attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
     
    newDimensions.append('text')
                 .style("text-anchor", "middle")
                 .attr("y", -9)
                 .style("font-size", "1rem")
                 .text(function(d) { return d; })
    
    newDimensions.append('g')
                 .attr("class", "axis")
                .each(function(d) { d3.select(this).call(d3.axisLeft(yScales[d])) ; })
                .attr("fill", "black")
                .attr("stroke-width", 1)
    
    // Returns the path for a given data point.
    function pcPath(d, dimensions) {
      return line(dimensions.map(function(p) { //if (Number.isNaN(yScales[p](d.value[p])) ) 
                                                //{   //console.log(d); console.log(p); console.log(yScales[p](d.value[p]))   } 
                                                 return [ xScale(p), yScales[p](d.value[p]) ] 
                                              } )                         
                 )
    }

    var paths = pcSvg.selectAll(".day")
        .data(dataset)
    
    //console.log("Paths:")
    //console.log(paths)
    
    paths.exit().remove()
    
    paths.enter()
        .append("path")
        .attr("class", "day")
        .attr("stroke", function(){
            if (dimensions.length == 2) {
                return "brown"
            }
            else {
                return "blue"
            }
    })
        .attr("stroke-width", 2)
        .attr("fill", "none")
     .merge(paths)
        .attr("d", function(d) { return pcPath(d, dimensions) })

}

        