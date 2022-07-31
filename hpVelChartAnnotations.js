// var margin = {top: 50, right: 50, bottom: 50, left: 50},
//     width = 800 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// var x = d3.scaleLinear()
//     .domain([2000,2022])
//     .range([ 0, width ]);

// var y = d3.scaleLinear()
//     .domain([0, 17194.5])
//     .range([ height, 0 ]);

const margin = {top: 20, right: 20, bottom: 30, left: 50},
height = 500 - margin.top - margin.bottom;
const maxWidth = 860 - margin.left - margin.right;
let width = 860 - margin.left - margin.right;


const parseTime = d3.timeParse("%d-%b-%y");
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const valueline = d3.line()
.x(d => x(d.date))
.y(d => y(d.close));

const svg = d3.select("svg")
.attr("width", 960)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


// //Add annotations
// var labels = [{
//   data: { year: "2004", month: "07", note: "Harry Potter and the Prisoners of Azkaban Book"},
//   dy: 37,
//   dx: -142
// }].map(function (l) {
//   l.note = Object.assign({}, l.note, { title: "Close: " + l.data.close,
//     label: "" + l.data.date });
//   l.subject = { radius: 4 };

//   return l;
// });

//Add annotations
const labels = [
  {
    data: {date: "9-Apr-12",	close: 636.23},
    dy: 37,
    dx: -142
  },
  {
    data: {date: "26-Feb-08",	close: 119.15},
    dy: -137,
    dx: 0,
    note: { align: "middle"}
  },
  {
    data: {date: "18-Sep-09",	close: 185.02},
    dy: 37,
    dx: 42,
  }
].map(l => {
  l.note = Object.assign({}, l.note, { title: `Close: ${l.data.close}`,
    label: `${l.data.date}`})
  l.subject = { radius: 4}

  return l
})
  

const timeFormat = d3.timeFormat("%d-%b-%y")

const makeAnnotations = d3.annotation()
  .annotations(labels)
  .type(d3.annotationCalloutCircle)
  .accessors({ x: d => x(parseTime(d.date)), 
    y: d => y(d.close)
  })
  .accessorsInverse({
    date: d => timeFormat(x.invert(d.x)),
    close: d => y.invert(d.y) 
  })
  .on('subjectover', function(annotation) {
    annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
      .classed("hidden", false)
  })
  .on('subjectout', function(annotation) {
    annotation.type.a.selectAll("g.annotation-connector, g.annotation-note")
      .classed("hidden", true)
  })

function init(junk){
  svg.append("g")
  .attr("class", "annotation-test")
  .call(makeAnnotations)

  svg.selectAll("g.annotation-connector, g.annotation-note")
    .classed("hidden", true)
}