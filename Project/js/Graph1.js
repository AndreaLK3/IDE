function init1() {   
    
    //////////////Costants and svg
    var parseTime = d3.timeParse("%d/%m/%Y");

    const xValue = d => d.Date;
    const xLabel = 'Dates';
    const yValue = d => d.NOX;
    const yLabel = 'Greenhouse Gases/ Particulates';


    const margin = { left: 120, right: 30, top: 40, bottom: 120 };

    const svg = d3.select('svg');
    const width = svg.attr('width');
    const height = svg.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const xAxisG = g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG = g.append('g');
    
    var formatTime = d3.timeFormat("%b %e");
    //////////////
    
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear();
    
    
    ////// The graph's axes and their labels
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickPadding(15)
                    .tickSize(-innerHeight);

    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5)
                    .tickPadding(15)
                    .tickSize(-innerWidth);

    const row = d => {
                    d.Date = parseTime(d.Date);
                    d.NOX = +d.NOX;
                    return d;
                    };

    xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', 50)
      .text(xLabel);

    yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .attr('transform', `rotate(-90)`)
      .style('text-anchor', 'middle')
      .text(yLabel);
    
    var div = d3.select("body")
              .append("div")              .attr("class", "tooltip")
              .style("opacity", 0);
    
    ////////////// read the CSV, and proceed
    d3.csv('data/newAndersenBoulevard.csv', data => {

        
        //////////// Create the dataset for the scatterplot
        var gasNames = d3.keys(data[0])
                     .filter(function(d) { return d !== "Date" && d !== "Time"; })
                     .sort();

        var mapping = gasNames.map(function(mapping) {
          return data.map(function(d) {
            return {key: mapping, time: d.Time, x: parseTime(d.Date), y: +d[mapping]};
          });
        });

        var mapping1 = mapping.map(function(unnamedArray) {
          return {key : unnamedArray[0].key, value: unnamedArray}
        })

        var pointsDisplayed = [];
        gasNames.forEach(function(gas) {
          pointsToAdd = ( mapping1.filter(function(subArray) { if (subArray.key == gas ){return true} else{return false}}) )[0].value
          pointsDisplayed = pointsDisplayed.concat(pointsToAdd)
        })

        var legends = width/gasNames.length;
        
        ///////////// The scales
        var zScale  = {};
        gasNames.forEach(function(gas, i) {
          zScale[gas] = d3.schemeCategory10[i];
        })

        xScale
          .domain(d3.extent(d3.merge(mapping), function(d) { return d.x; }))
          //.domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();

        yScale
          .domain(d3.extent(d3.merge(mapping), function(d) { return d.y; }))
          //.domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();

        selectedGasNames = gasNames.slice();
    
        
        ///Inner function to update the scatterplot
          function updategraph1(svg, selectedGasNames) {

    svg.selectAll('*').remove()
    console.log("Updating Graph1")
    var g1 = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`)

    var pointsDisplayed = [];
    selectedGasNames.forEach(function(gas) {
        pointsToAdd = ( mapping1.filter(function(subArray) { if (subArray.key == gas ){return true} else{return false}}) )[0].value
        pointsDisplayed = pointsDisplayed.concat(pointsToAdd)
    })

    pointsDisplayed = pointsDisplayed.filter(function(point) {
        if(point.y == "" || point === undefined) {
                return false;
        }else {
            return true;
        }
    })

    yScale.domain(d3.extent(pointsDisplayed, function(d) { return d.y; }))
    //.domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    
    const xAxisG1 = g1.append('g')
                    .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG1 = g1.append('g');
              
    xAxisG1.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', 50)
        .text(xLabel);

    yAxisG1.append('text')
        .attr('class', 'axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .text(yLabel);

    xAxisG1.call(xAxis);
    yAxisG1.call(yAxis);

    g1.selectAll(".mapping")
        .data(pointsDisplayed)
        .enter()
        .append("circle")
            .attr("class", "mapping")
            .attr("r", 4.5)
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .style("fill", function(d, i) { return zScale[d.key]; })
            .on("mouseover", function(d) {
                        div.transition()
                            .duration(50)
                            .style("opacity", .9);
                        div .html(
                            "Date: " + formatTime(d.x) +
                            "<br/>"  + "Value: " + d.y +
                            "<br/>"  + "Time: " + d.time + 
                            "<br/>"  + "Gas: " + d.key)     
                            .style("left", (d3.event.pageX) + "px")             
                            .style("top", (d3.event.pageY - 28) + "px");

//                        g1.append("text")
//                            .attr("x", (innerWidth / 2))             
//                            .attr("y", 0 - (margin.top / 3))
//                            .attr("text-anchor", "middle")  
//                            .style("font-size", "16px") 
//                            .text("Scatter Plot of Greenhouse Gases/Particulates");   

        })
    
}
    
        
        
        
        d3.select("#graph1buttons").append("g")
          .selectAll(".scatterlegend")
          .data(selectedGasNames)
          .enter()
          .append("input")
          .attr("type", "button")
          .style("background-color", "lightsteelblue")
          .style("border-color", "black")
          .attr("class", "scatterlegend")
          .attr("value", function (d){return d;})
          .on("click", function(d,i) {
               d3.selectAll(".scatterlegend")
                 .style("background-color", "lightsteelblue")
                 .style("border-color", "black")
        
               d3.select(this)
               .style("background-color", "red")
               .style("border-color", "black")
               selectedGasNames = [d];
               updategraph1(svg, selectedGasNames)})
          
        
        g.selectAll(".mapping")
         .data(pointsDisplayed)
         .enter()
         .append("circle")
         .attr("class", "mapping")
         .attr("r", 4.5)
         .attr("cx", function(d) { return xScale(d.x); })
         .attr("cy", function(d) { return yScale(d.y); })
         .style("fill", function(d, i) { return zScale[d.key]; })
         .on("mouseover", function(d) {
              div.transition()
                 .duration(50)
                 .style("opacity", .9);
              div .html(
                 "Date: " + formatTime(d.x) +
                "<br/>"  + "Value: " + d.y +
                "<br/>"  + "Time: " + d.time + 
                "<br/>"  + "Gas: " + d.key)     
         .style("left", (d3.event.pageX) + "px")             
         .style("top", (d3.event.pageY - 28) + "px");

       });

//        g.append("text")
//         .attr("x", (innerWidth / 2))             
//         .attr("y", 0 - (margin.top / 3))
//         .attr("text-anchor", "middle")  
//         .style("font-size", "16px") 
//         .text("Scatter Plot of Greenhouse Gases/Particulates");      
       
         xAxisG.call(xAxis);
         yAxisG.call(yAxis);
        
        
    //slider section
          
    //Helper function: operates in the range [0,48]. The parameters hour and minutes are used for the recursive call, 
    // and when invoked from the outside they stary at 0
    function convertNumberToHour(n, hour, minutes){
        if (n <= 0) {
            if (minutes == 0) {minutes = "00"}
            if (hour < 10) {hour = "0"+hour}
            return ""+hour+":"+minutes
        }
        else {
            if (minutes == 0) {
                var new_minutes = 30
                var new_hour = hour
            }
            if (minutes == 30) {
                var new_minutes = 0
                var new_hour = hour +1
                
            }
            return convertNumberToHour(n-1, new_hour, new_minutes)
        }
    }
        
    var sliderSvg = d3.select("#sliderContainerSvg")

    var sliderXscale = d3.scaleLinear()
                        .domain([0, 47])
                        .range([0, innerWidth])
                        .clamp(true);
        
    var slider = sliderSvg.append("g")
                      .attr("class", "slider")
                      .attr("transform", "translate(" + margin.left + "," + 50 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", sliderXscale.range()[0])
        .attr("x2", sliderXscale.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { dragHandle(sliderXscale.invert(d3.event.x)); })
        .on("end", function(evt, value) { 
                        slideNumber = parseInt( Math.round(sliderXscale.invert(d3.event.x),2) ) 
                        slideHour = convertNumberToHour(slideNumber, 0,0) 
                        console.log(slideHour) 
                        d3.select("#displayedHour")
                            .text(slideHour)
                        timeSlider(slideHour)}));

    slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
           // .attr("y", innerHeight -5)
            .selectAll("text")
            .data( sliderXscale.ticks(30).map(function(n) {return convertNumberToHour(n,0,0)})  )
            .enter().append("text")
            .attr("x", function(d,i){ return i * (innerWidth / 24)})
            .attr("text-anchor", "middle")
            .text(function(d,i) { return d.slice(0,2) });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue", function() {   });

function dragHandle(h) {
  handle.attr("cx", sliderXscale(h));
  //svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}

function timeSlider(specifiedTime) {

          svg.selectAll('*').remove()
          console.log("Updating Graph1")
          var g2 = svg.append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`)
    
          const xAxisG2 = g2.append('g')
          .attr('transform', `translate(0, ${innerHeight})`);
     
          const yAxisG2 = g2.append('g');
    
                  
        xAxisG2.append('text')
            .attr('class', 'axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', 50)
            .text(xLabel);

        yAxisG2.append('text')
            .attr('class', 'axis-label')
            .attr('x', -innerHeight / 2)
            .attr('y', -60)
            .attr('transform', `rotate(-90)`)
            .style('text-anchor', 'middle')
            .text(yLabel);

        xAxisG2.call(xAxis);
        yAxisG2.call(yAxis);

          var pointsDisplayed = [];
          selectedGasNames.forEach(function(gas) {
              pointsToAdd = ( mapping1.filter(function(subArray) { if (subArray.key == gas ){return true} else{return false}}) )[0].value
              pointsDisplayed = pointsDisplayed.concat(pointsToAdd)
        })

        pointsDisplayed = pointsDisplayed.filter(function(point) {
          if(point.time == specifiedTime) {
          return true;
          }else {
          return false;
          }
        })


        g2.selectAll(".mapping")
                 .data(pointsDisplayed)
                 .enter()
                 .append("circle")
                 .attr("class", "mapping")
                 .attr("r", 4.5)
                 .attr("cx", function(d) { return xScale(d.x); })
                 .attr("cy", function(d) { return yScale(d.y); })
                 .style("fill", function(d, i) { return zScale[d.key]; })
                 .on("mouseover", function(d) {
                      div.transition()
                         .duration(50)
                         .style("opacity", .9);
                      div .html(
                         "Date: " + formatTime(d.x) +
                        "<br/>"  + "Value: " + d.y +
                        "<br/>"  + "Time: " + d.time + 
                        "<br/>"  + "Gas: " + d.key)     
                 .style("left", (d3.event.pageX) + "px")             
                 .style("top", (d3.event.pageY - 28) + "px");

          g2.append("text")
                 .attr("x", (innerWidth / 2))             
                 .attr("y", 0 - (margin.top / 3))
                 .attr("text-anchor", "middle")  
                 .style("font-size", "16px") 
                 .text("Scatter Plot of Greenhouse Gases/Particulates");      


} )

}
    
})
}    