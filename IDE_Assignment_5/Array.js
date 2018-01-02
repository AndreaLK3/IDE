d3.select(window).on('load', init);

function init() {
    d3.csv(
        'sf_crime.csv',
        function(error, data) {
            if (error) throw error;
            console.log(data);
        });
}