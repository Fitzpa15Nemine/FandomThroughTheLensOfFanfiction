
var width = 500;
var height = 200;
var margin = 50;

const x = d3.scaleLinear().domain([2000,2022]).range([0,width - margin * 3]);
const y = d3.scaleLinear().domain([0,3000]).range([height,0]);
const formatYear = d3.timeFormat("%d");

const svg = d3.select("#chart")
    .attr("height", height + 2*margin)
    .attr("width", width + 2*margin)
    .append("svg")
    .attr("viewBox",'0 0 ' + width + ' ' + height * 2)
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")")



svg.attr("width", width + 2*margin)
    .append("g")
    .attr("transform","translate(" + margin + ","  + margin * 5 + ")")
    .attr("class", "xaxis")
    .call(d3.axisBottom(x))
    .attr("fill","none");

svg.attr("height", height + 2*margin)
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")")
    .attr("class", "yaxis")
    .call(d3.axisLeft(y));

function init(){
    d3.csv("FFSampleMockData.csv").then((data) => {
        data.forEach((d) => {
            return { fandom : d.fandom, ficcount : +d.ficcount, date: d3.timeParse("%Y-%m-%d", d.date) }
        });

        console.log(data);
        console.log("another iteration");

        svg.selectAll("line")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "none")
        //.attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line().data(d)
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.ficcount); })
            (d.fandom)
        })
        // var x_axis = d3.axisBottom(x);

        // svg.attr("height", height + 2*margin)
        // .append("g")
        // .attr("transform","translate(" + margin + "," + margin + ")")
        // .call(d3.axisLeft(y));

        // svg.attr("width", width + 2*margin)
        // .append("g")
        // .attr("transform","translate(" + margin + "," + margin * 5 +")")
        // .call(x_axis)
        // .attr("fill","none");
        // const singleLine = d3.line()
        // .data()
        // .x(function(d){return x(d.date);})
        // .y(function(d){return y(d.ficcount);})
        // .curve(d3.curveCardinal);

        // svg.append("path")
        // .data([data])
        // .attr("class","line")
        // .attr("d", singleLine);

        // d3.select("svg").append("path")
        // .datum(data)
        // .attr("fill", "none")
        // .attr("stroke-width", 1.5)
        // .attr("d", d3.line()
        //     .x(function(d) { return x(+d.date); })
        //     .y(function(d) { return y(+d.ficcount); })
        //     );
        // .attr("d", d3.line()
        //     .x(function(d,i) { return x(ffarchive[i].Year + ffarchive[i].Month/12); })
        //     .y(function(d,i) { return y(ffarchive[i].ficcount); })
        //     );
    
    });
}