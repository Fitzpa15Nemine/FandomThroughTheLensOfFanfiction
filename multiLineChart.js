"use strict";

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

function init(filename, labelsInput){
    d3.csv(filename, function(data) {
        var nestStat = d3.nest() 
            .key(function(d) { return d.fandom;})
            .entries(data);
        
        //console.log(d3.extent(data, function(d) { return d.year; }))
        var _x = d3.scaleLinear()
            .domain([2000,2022])
            .range([ 0, width ]);
        
        var _y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.fic; })])
            .range([ height, 0 ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(_x).ticks(11));
        svg.append("g")
            .call(d3.axisLeft(_y));
        
        // adding lots of colors
        var res = nestStat.map(function(d){ return d.key })
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#7A4988','#367eb6','#4cab4b','#973ea3','#999999','#fe7f10','#fefe30','#a25625','#292929'])
        
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
                    .x(function(d) { return _x(d.year - -1 * d.month/12); })
                    .y(function(d) { return _y(+d.fic); })
                    (d.values)
                })
        
        var labels = labelsInput.map(function (l) {
            l.note = Object.assign({}, l.note, { title: l.data.title,
                label: l.data.dateText });
            l.subject = { radius: 4 };

            return l;
        })

        const makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ 
            x: function x(d) {
                return _x(d.year - -1 * d.month/12);
            },
            y: function y(d) {
                return _y(+d.fic);
            }
            }).on('subjectover', function (annotation) {
                annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
            }).on('subjectout', function (annotation) {
                annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
            });

        svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

        svg.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
    
    })
}

