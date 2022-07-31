var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#bulkChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

function init(filename){
    d3.csv(filename, function(data) {
        var nestStat = d3.nest() 
            .key(function(d) { return d.fandom;})
            .entries(data);
        
        //console.log(d3.extent(data, function(d) { return d.year; }))
        var x = d3.scaleLinear()
            .domain([2000,2022])
            .range([ 0, width ]);
        
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.fic; })])
            .range([ height, 0 ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(11));
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // adding lots of colors
        var res = nestStat.map(function(d){ return d.key })
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#7A4988','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        
        // rendering the data
        svg.selectAll(".line")
            .data(nestStat)
            .enter()
            .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return x(d.year - -1 * d.month/12); })
                    .y(function(d) { return y(+d.fic); })
                    (d.values)
                })
        
        })
    }

