//Utility functions

//1.Database

function extractDateTime(timestamp){
    var dt = timestamp.split(" ")
    var date = dt[0]
    var time = dt[1]
    //console.log(time)
    if (time.length==4){
        time = "0" + time
    }
    if (time.length==8){
        time = time.substring(0, 5)
    }
    return [date, time]
}

//Can read both formats "31-12-2017" and "2/1/18", and turn them into "2017-12-31" 
function parseDate(dateString){
    var dateArray = []
    if (dateString.includes("-")){
        dateArray = dateString.split("-")
    }
    if (dateString.includes("/")){
        dateArray = dateString.split("/")
    }    
    //console.log(dateArray)
    var d = dateArray[0]
    if (d.length == 1){
        d = "0" + d
    }
    var m = dateArray[1]
        if (m.length == 1){
        m = "0" + m
    }
    if (dateArray[2].length <= 2){
        var Y = "20" + dateArray[2]
    }
    else{
        Y = dateArray[2]
    }
    
    return [Y,m,d].join("-")
}


////////// Preprocessing : Read the dataset, and split the Timestamp into Date and Time
function addDateAndTime(dataset){
    var dataset_new = []
    dataset.forEach(function(d){
                                    var dateAndTime = extractDateTime(d.Timestamp);
                                    d["Date"] = dateAndTime[0]; 
                                    d["Time"] = dateAndTime[1];
                                    //console.log(d)
                                    dataset_new.push(d);
                                    return true;})

    //console.log(dataset_new)
    return dataset_new
}
////////////////////
        
/// Preprocessing : While reading the weather or stations dataset,
/// replace "Ukendt" string values with 0s, and remove the measurements that have all values == 0
/// (note: when joining different datasets, we will need to exclude values that exist only in one)
function filterDataset(dataset){
    var weather_keys = Object.keys(dataset[0]);

    var dataset_new = []
    dataset.forEach(function(d,i){
                                    dataset[i].Timestamp = parseDate(dataset[i].Date)+";"+dataset[i].Time
                                
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
                                    dataset[i].Date = parseDate(dataset[i].Date)
                                    
                                    return true;
                                    } )
    
    return dataset_new
}
////////////////////
                        
            
////////// Join 2 datasets using a specified property as 'key'
function joinDatasets(ds1, ds2, keyName){
    var joined_ds = ds1
    //console.log(ds1)
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


///////// Filter a dataset with a date interval (min and max). 
// The dataset is expected to be in aggregated-Day form [{key = "12-31-2017", value=...},{...}]
function filterAgDayDataset_byDay(dataset, minDate, maxDate){
    index_start = 0
    offset_end = 0
    dataset.forEach(function(d,i){
        dateObject = new Date(d.key)
        //console.log(dateObject)
        if (dateObject < minDate){
            offset_end++
        }
    })
    dataset.forEach(function(d,i){
        dateObject = new Date(d.key)
        //console.log(dateObject)
        if (dateObject > maxDate){
            index_start++
        }
    })

    //console.log("Start at: " + dataset[dataset.length - offset_end - 1].Date)
    console.log("Start at: " +dataset[dataset.length - offset_end - 1].key)
    
    //console.log("End at: " + dataset[index_start].Date)
    console.log("End at: " +dataset[index_start].key)
    
    //console.log(index_start,  dataset.length - offset_end)
    return dataset.slice(index_start, dataset.length - offset_end)
    
}



///////// Filter a dataset with a date interval (min and max). 
// We expect the dataset to be an array of object with a 'Date' key (it's a dateString...) property 
// The purpose of this function is to filter a raw_dataset (without groupings or nested structures )
function filterRawDatasetByDay(dataset, minDate, maxDate){
    index_start = 0
    offset_end = 0
    dataset.forEach(function(d,i){
        dateObject = new Date(d.Date)
        //console.log(dateObject)
        if (dateObject < minDate){
            offset_end++
        }
    })
    dataset.forEach(function(d,i){
        dateObject = new Date(d.Date)
        //console.log(dateObject)
        if (dateObject > maxDate){
            index_start++
        }
    })

    //console.log("Start at: " + dataset[dataset.length - offset_end - 1].Date)
    console.log("Start at: " +dataset[dataset.length - offset_end - 1].Date)
    
    //console.log("End at: " + dataset[index_start].Date)
    console.log("End at: " +dataset[index_start].Date)
    
    //console.log(index_start,  dataset.length - offset_end)
    return dataset.slice(index_start, dataset.length - offset_end)
    
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

//This function modifies the array passed to it, 
//eliminating 1 copy of the specified object
function removeFromArray(arr, obj){
    var index = arr.indexOf(obj)
    if (index > -1) {
        arr.splice(index, 1);
    }
}


