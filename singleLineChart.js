
var width = 500;
var height = 200;
var margin = 50;

const x = d3.scaleTime().domain([2000,2022]).range([0,width]);
const y = d3.scaleLinear().domain([0,500000]).range([height,0]);

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox",'0 0 ' + width - -margin + ' ' + height - -margin)
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")")

const singleLine = d3.line()
    .x(function(d){return x(d.date);})
    .y(function(d){return y(d.date);})



function init(){
    d3.csv("FFSampleMockData.csv").then((data) => {
        data.forEach((d) => {
            return { fandom : d.fandom, ficcount : +d.ficcount, date: d3.timeParse("%Y-%m-%d")(d.date) }
        });

        console.log(data);
        console.log("another iteration");
        var x_axis = d3.axisBottom(x);

        d3.select("svg")
        .attr("height", height + 2*margin)
        .append("g")
        .attr("transform","translate(" + margin + "," + margin + ")")
        .call(d3.axisLeft(y));

        d3.select("svg")
        .attr("width", width + 2*margin)
        .append("g")
        .attr("transform","translate(" + margin + "," + margin * 5 +")")
        .call(x_axis)
        .attr("fill","none");

        d3.select("svg").append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(+d.date); })
            .y(function(d) { return y(+d.ficcount); })
            );
        // .attr("d", d3.line()
        //     .x(function(d,i) { return x(ffarchive[i].Year + ffarchive[i].Month/12); })
        //     .y(function(d,i) { return y(ffarchive[i].ficcount); })
        //     );
    
    });
}