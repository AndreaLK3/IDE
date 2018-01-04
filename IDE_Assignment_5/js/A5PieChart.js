
    //Imported from https://codepen.io/w3core/pen/DjLml to have input fields that dinamycally resize depending on the text
    function resizable (el, factor) {
      var int = Number(factor) || 7.7;
      function resize() {el.style.width = ((el.value.length+1) * int) + 'px'}
      var e = 'keyup,keypress,focus,blur,change'.split(',');
      for (var i in e) el.addEventListener(e[i],resize,false);
      resize();
    }
    
function updatePieChart(districtName, crimesByDistrictAndCategory) {
           
            chosenDistrict = crimesByDistrictAndCategory.find(function (elem) { 
                                                             //console.log(elem.key) ; 
                                                             return elem.key === districtName })

            CDcrimeNumbersArray = chosenDistrict.value
            
            /////// This part of the code sort the array of crime categories, and 
            /////// selects the most frequent 6 categories, for the pie visualization
            CDcrimeNumbersArray.sort(function(a,b) {
                if (a.value > b.value) {
                    return -1
                } else
                {
                    return 1
                }
            })
            console.log(CDcrimeNumbersArray)
            mainCrimesNumbersArray = CDcrimeNumbersArray.slice(0,7)            
            console.log(mainCrimesNumbersArray)
            ///////
        
            var margin = {top: 50, right: 50, bottom: 50, left: 50};
            var pie_width =  0.4 * window.screen.width//+svg.node().getBoundingClientRect().width - margin.left - margin.right;
            var pie_height = 0.9 * pie_width//+svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
            var pv_svg = d3.select('#pieVisualization')
                           .style('width', pie_width)
                           .style('height', pie_height)
                           .style('border', '1px solid gray')

            var g = pv_svg.append("g")
                .attr("transform",
                    "translate(" + pie_width / 3 + "," + pie_height / 3 + ")");
                        
            // Create arc-data generator
            var arcs = d3.pie();

            // Create arc path generator
            var arc = d3.arc()
                .innerRadius(10)
                .outerRadius(0.4 * pie_width);

            //Create the 'numbers array' for the arcs creation
            arcsdata = []
            for (i=0; i < mainCrimesNumbersArray.length; i++) {
                c = mainCrimesNumbersArray[i]
                arcsdata.push(c.value)
            }
            console.log(arcsdata)
            
            // Create group element for each data point
            var gInner = g.selectAll('g')
                .data(arcs(arcsdata))
                .enter()
                .append('g')
                .attr('transform', 'translate(100, 100)')

            // Add arc to group elements
            gInner.append('path')
                .attr('d', function(d){//console.log(d); 
                                       return arc(d);})
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("fill", "#ccc")
            
            //////// Adding text to the arcs
            t = gInner.append('text')
                //.text(function(d, i){return mainCrimesNumbersArray[i].key + " : " + d.data ;})
                .attr('transform',
                     function(d){return 'translate(' + arc.centroid(d) + ')';})
                .attr('text-anchor', 'middle')
 
            t.append('tspan')
                .text(function(d,i) { return mainCrimesNumbersArray[i].key + " : "})                

            t.append('tspan')
                .attr('dy', 15)
                .attr('x', 0)
                .text(function(d,i) { return d.data})
            ////////
    
            /////// Updating the fields' text in the HTML
        
            totCrimes = arcsdata.reduce(function(a,b) {return a+b}, 0)
            d3.select("#totCrimesField")
              .attr("value", totCrimes)
              .style("font-weight", "bold")
    
            mainCrime = mainCrimesNumbersArray[0].key
            mainCrimeNumber = mainCrimesNumbersArray[0].value
            d3.select("#mainCatField")
              .attr("value", mainCrime + " (" + mainCrimeNumber + " / " + totCrimes + ")")// + " ( " + mainCrimeNumber + " / " totCrimes + " ) "
              .style("font-weight", "bold")
            resizable(document.getElementById('mainCatField'),7);
   
    }
    
    
    d3.select(window).on('load', init);
    function init() {
        
        d3.text('sf_crime.csv', function(error, raw_data){
            var crimeTable = d3.csvParse(raw_data);
            console.log(crimeTable);

            console.log(crimeTable[0]);


            //Creates a multi-level array object, that stores the count of the crimes, per district and per category
            //At the 1st level : [ {key: "INGLESIDE", value: Array(30)}, {key: "BAYVIEW", value: Array(30)} ... ]
            //At the 2nd level, opening up the array associated with each district:
            //[{key: "OTHER OFFENSES", value: 157}, {key: "LARCENY/THEFT", value: 100} , ...]            
            var crimesByDistrictAndCategory = d3.nest()
                                                .key(function(d) { return d.PdDistrict; })
                                                .rollup(function(arr) {
                                                            cc =
                                                            d3.nest()
                                                              .key(function(d) { return d.Category; })
                                                              .rollup(function (crimesArr) { return crimesArr.length })
                                                              .entries(arr);
                                                            return cc})
                                                .entries(crimeTable);

            console.log(crimesByDistrictAndCategory)
            
            
            /////Create one button for each district. 
            /////When a button is pressed, we update accordingly the pie chart
            for (i=0; i < crimesByDistrictAndCategory.length ; i++){
                //<input type="button" name="button" id="button1" value="Button text"/>
                c = crimesByDistrictAndCategory[i]
                d3.select("#buttonsPanel")
                  .append('input')
                  .attr('type', 'button')
                  .attr('name', c.key)
                  .attr('id',  c.key)
                  .attr('value',  c.key)
                  .attr('border', '1px solid gray')
                  .on("click", function(){
                                    d3.select("pieVisualization").selectAll("*").remove();
                                    d3.select('#currentDistrictField').attr('value', this.id)
                                      .style("font-weight", "bold");
                                    updatePieChart(this.id, crimesByDistrictAndCategory)
                                    });
            }
//// Yet another section: bar plot of the total crime numbers per district
            
            var totCrimesData = [];

            console.log(crimesByDistrictAndCategory)
            for(var i = 0; i < crimesByDistrictAndCategory.length; i++){ //
                //console.log(crimesByDistrictAndCategory[i].key)
                var districtRecord = crimesByDistrictAndCategory[i].value
                allCrimesNumbersList = []
                for (j=0; j < districtRecord.length; j++) {
                    c = districtRecord[j]
                    allCrimesNumbersList.push(c.value)
                }
            totCrimes = allCrimesNumbersList.reduce(function(a,b) {return a+b}, 0)
            totCrimesData.push(totCrimes)
            }
            console.log(totCrimesData)
            
            var w = 0.5 * window.screen.width , h = 0.8 * w;
            var padding = 60;

            var svg_2 = d3.select('#barPlot')
                           .style('width', w)
                           .style('height', h)
                           .style('border', '1px solid gray');

            districtNames = crimesByDistrictAndCategory.map(function(d){ return d.key; })
            var x = d3.scaleBand()
                .domain(districtNames)
                .rangeRound([0 + padding, w - padding]);
            
            var y = d3.scaleLinear()
                .domain([0, d3.max(totCrimesData)])
                .range([h - padding , 0 + padding]); 

             svg_2.selectAll(".bar")
                .data(totCrimesData)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d,i) { return ""+x(crimesByDistrictAndCategory[i].key)+""; })
                  .attr("y", function(d) { return y(d); })
                  .attr("width", w / districtNames.length - 30)
                  .attr("height", function(d) { return h - y(d) - padding; })
            
            /** Axis **/
            svg_2.append("g")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(d3.axisBottom(x));
            
            svg_2.append("g")
                .attr("transform", "translate(" + padding + ", 0 )")
                .call(d3.axisLeft(y));
            
            /*** Axis labels and Legend ***/
            // text label for the x axis
            svg_2.append("text")             
               .attr("transform", "translate(" + w/2 + " ," + 
                                       (h- padding + 40) + ")")
               .style("text-anchor", "middle")
               .style("font-size", "1.2rem")
               .text("District");
          
            // text label for the y axis
            svg_2.append("text")
                 .attr("transform", "rotate(-90)")
                 .attr("y", 0 + padding - 60)
                 .attr("x",0 - (h / 2))
                 .attr("dy", "1em")
                 .style("font-size", "1.2rem")
                 .style("text-anchor", "middle")
                 .text("Total number of crimes"); 

        });



    } 