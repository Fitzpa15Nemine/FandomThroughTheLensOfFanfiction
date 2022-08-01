"use strict";

var margin = {top: 50, right: 50, bottom: 50, left: 75},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select(".bulkChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


function showAnnotations(){
    d3.selectAll("g.annotation-connector, g.annotation-note")
        .transition()
        .duration(3000)
        .delay(function(d, i) { return i * 900; })
        .style("opacity", 100);

    d3.selectAll("g.annotation-connector, g.annotation-note")
        .transition()
        .duration(3000)
        .delay(function(d, i) { return i * 900 + 400; })
        .style("opacity", 0);
}

function init(filename, labelsInput, chartLineColor, yaxisLabel){
    d3.csv(filename, function(data) {
        var nestStat = d3.nest() 
            .key(function(d) { return d.fandom;})
            .entries(data);
        
        //adding scales, year extent sometimes is troublesome so hardcoding
        //console.log(d3.extent(data, function(d) { return d.year; }))
        var _x = d3.scaleLinear()
            .domain([2000,2022])
            .range([ 0, width ]);
        
        var _y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.fic; })])
            .range([ height, 0 ]);

        //adding the axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(_x).ticks(11));
        svg.append("g")
            .call(d3.axisLeft(_y));

        //label some axis
        svg.append("text")      
        .attr("x", width/2 )
        .attr("y",  _y(0) + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Year");

        svg.append("text")
        .attr("transform", "rotate(-90)")      
        .attr("x", 0 - height/2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yaxisLabel);

        // path
        //     .attr('stroke-dashoffset', pathLength)
        //     .attr('stroke-dasharray', pathLength);
        
        const transitionPath = d3
            .transition()
            .duration(0);
    
        // path
        //     .attr('stroke-dashoffset', pathLength)
        //     .attr('stroke-dasharray', pathLength)
        //     .transition(transitionPath)
        //     .attr('stroke-dashoffset', 0);
        
        // rendering the data
        svg.selectAll(".line")
            .data(nestStat)
            .enter()
            .append("path")
                .attr("fill", "none")
                //.attr("transform",'translate($(margin.left},0)')
                .attr("stroke", chartLineColor)
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
                annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").style("opacity", 100);
            }).on('subjectout', function (annotation) {
                annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").style("opacity", 0);
            });

        svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

        //svg.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
    
        svg.selectAll("g.annotation-connector, g.annotation-note").style("opacity", 0);
        
    })
}

