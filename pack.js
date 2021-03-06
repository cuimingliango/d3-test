function pack(){
  d3.select("svg")
       .remove();
  d3.select(".credit")
    .remove();
var margin = 10,
    outerDiameter = 500,
    innerDiameter = outerDiameter - margin - margin;

var x = d3.scale.linear()
    .range([0, innerDiameter]);

var y = d3.scale.linear()
    .range([0, innerDiameter]);


var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(200,80%,80%)", "hsl(224,30%,40%)"])
    //.attr("fill", function() { if (d.value > d.bud13) {return red;} else {return green;} })
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([innerDiameter, innerDiameter])
    .value(function(d) { return d.value; })

var svg = d3.select("#chart").append("svg")
    .attr("width", outerDiameter)
    .attr("height", outerDiameter)
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

d3.select("#chart").append("html")
  .attr("class", "credit")
  .html('<p>Based on <a href="http://bl.ocks.org/mbostock/7607535">Zoomable Circle Packing</a> by Mike Bostock.</p>');

d3.json("flare.json", function(error, root) {
  var focus = root,
      nodes = pack.nodes(root);

  svg.append("g").selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      //.attr("fill", function() { if (d.value > d.bud13) {return red;} else {return green;} })
      .on("click", function(d) { return zoom(focus == d ? root : d); });

  
  svg.append("g").selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", "packlabel")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      //.style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? null : "none"; })
      .text(function(d) { if (d.r > 30) return d.name; });

  d3.select(window)
      .on("click", function() { zoom(root); });

  function zoom(d, i) {
    var focus0 = focus;
    focus = d;

    var k = innerDiameter / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);
    d3.event.stopPropagation();

    var transition = d3.selectAll("text,circle").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    transition.filter("circle")
        .attr("r", function(d) { return k * d.r; });

    transition.filter("text")
      .filter(function(d) { return d.parent === focus || d.parent === focus0; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }
});

d3.select(self.frameElement).style("height", outerDiameter + "px");
}