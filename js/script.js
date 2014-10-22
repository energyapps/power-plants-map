var width = 960,
    height = 600;


var projection = d3.geo.albersUsa();
      
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var radius = d3.scale.sqrt()
    .domain([0, 1000])
    .range([10, 25]);


var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
  .selectAll("g")
    .data([1000, 3000, 6000])
  .enter().append("g");

legend.append("circle")
    .attr("cy", function(d) { return -radius(d); })
    .attr("r", radius);

legend.append("text")
    .attr("y", function(d) { return -2 * radius(d); })
    .attr("dy", "1.3em")
    .text(d3.format(".1s"));

d3.json("js/us_10m_topo4.json", function(error, us) {
  if (error) return console.error(error);

  svg.selectAll(".state")
    .data(topojson.feature(us, us.objects.us_10m).features)
    .enter().append("path")
      .attr("class", function(d) {return "state " + d.id; })
      .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.us_10m, function(a,b) {return a !== b;}))
    .attr("d", path)
    .attr("class", "state-boundary")

  svg.append("g")
    .attr("class", "bubble")
  .selectAll("circle")
    .data(topojson.feature(us, us.objects.us_10m).features
      .sort(function(a, b) { return b.properties.nat_gas - a.properties.nat_gas; }))
  .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("r", function(d) { return radius(d.properties.nat_gas)});
});