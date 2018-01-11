//Utility functions

//1.Database

function extractDateTime(timestamp){
    var dt = timestamp.split(" ")
    return dt
}


////////// Preprocessing : Read the dataset, and split the Timestamp into Date and Time
function addDateAndTime(dataset){
    var dataset_new = []
    d3.select('#parallCoord1')
      .selectAll('g')
      .data(dataset)
      .enter()
      .append('g')
      .attr('preprocessingDone', function(d){
                                    var dateAndTime = extractDateTime(d.Timestamp);
                                    d["Date"] = dateAndTime[0]; 
                                    d["Time"] = dateAndTime[1];
                                    //console.log(d)
                                    dataset_new.push(d);
                                    return true;})

    d3.select("#parallCoord1").selectAll("*").remove();
    //console.log(dataset_new)
    return dataset_new
}
////////////////////
        
////////// Preprocessing : While reading the weather dataset,
////////// replace "Ukendt" string values with 0s, and remove the measurements that have all values == 0
function filterDataset(dataset){
    var weather_keys = Object.keys(dataset[0]);

    var dataset_new = []
    d3.select('#parallCoord1')
      .selectAll('g')
      .data(dataset)
      .enter()
      .append('g')
      .attr('filteringDone', function(d,i){
                                    for (var j=0; j < weather_keys.length; j++){
                                        var key = weather_keys[j];
                                        if (key!= "Timestamp" && key != "Date" && key != "Time") {
                                        if (Number.isNaN( parseFloat(dataset[i][key])) ){
                                            dataset[i][key] = 0
                                        }}
                                    }
                                    allZeros = true;
                                    for (var k=0; k < weather_keys.length; k++){
                                        var key = weather_keys[k];
                                        if (key!= "Timestamp" && key != "Date" && key != "Time"){
                                            if (parseFloat(dataset[i][key]) != 0 ){
                                                allZeros = false
                                        }}
                                    }
                                    if (! allZeros) {
                                        dataset_new.push(d);
                                    }
                                    return true;
                                    } )

    d3.select("#parallCoord1").selectAll("*").remove();
    return dataset_new
}
////////////////////
                        
            
////////// Join 2 datasets using a specified property as 'key'
function joinDatasets(ds1, ds2, keyName){
    joined_ds = ds1
    joined_ds.forEach( function( ds1Elem) {
        join_elemKey = ds1Elem[keyName]
        corresponding_ds2Elem = ds2.filter(function (ds2Elem){ return ds2Elem[keyName] == join_elemKey })[0]

    if ( !(ds1Elem === undefined) && !(corresponding_ds2Elem === undefined) ){
        Object.assign(ds1Elem.value, corresponding_ds2Elem.value)   
        }
    })
    return joined_ds
}
////////////////////
        
 ////////// Data aggregation by day (we compute the averages)        
    function aggregateByDay(old_dataset){       
        var datasetByDay = d3.nest()
            .key(function(d) { return d.Date; })
            .rollup(function(measurements_arr) { 
                
                var keys = Object.keys(measurements_arr[0])
                var ind_rm1 = keys.indexOf("Date"); keys.splice(ind_rm1, ind_rm1+1); 
                var ind_rm2 = keys.indexOf("Time"); keys.splice(ind_rm2, ind_rm2+1);
                var ind_rm3 = keys.indexOf("Timestamp"); keys.splice(ind_rm3, ind_rm3+1);
                    
                var avgs_obj = {};
                for (var i=0; i < keys.length; i++){
                    var key = keys[i];
                    avgs_obj[key] = getAverageOfProperty(measurements_arr, key)
                }
                return avgs_obj})
            .entries(old_dataset);

        //console.log(datasetByDay)
        return datasetByDay
    }
////////////////////


//2.General


//Replicates the behaviour of 'range(start, stop, step)' in Python
function pRange(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;  }

    if (typeof step == 'undefined') {
        step = 1;   }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];   }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);    }

    return result;
}
        

//Iterate through an array of objects and extract the average of a numerical property  
function getAverageOfProperty(arr, property){
    var sum = 0;
    var counter = 0;
    for (var i=0; i < arr.length; i++){
        var x = arr[i][property]
        if (x != "") {
            //console.log("i=" + i + " ; property = " + property + " : " +arr[i][property])
            sum = sum + parseFloat( arr[i][property] )
            counter++;
        }
    }
    //console.log(sum)
    var avg = sum / counter;
    return avg
}
    
//Iterate over an array of objects and recover the min and max values for the specified property
function getExtentOfProperty(arr, property){
    //console.log(property)
    var min = Number.POSITIVE_INFINITY; 
    var max = Number.NEGATIVE_INFINITY;
    for (var i=0; i < arr.length; i++){
        //console.log(arr[i].value)
        var x = arr[i].value[property]
        //console.log(x)
        if (x != "") {
            if (x < min){
                min = x
            }
            if (x > max){
                max = x
            }
        }
    }
return [min,max]
}
        

