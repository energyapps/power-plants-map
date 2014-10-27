var margin = 40,
    width = parseInt(d3.select("#map_container").style("width")) - margin*2,
    
    height = parseInt(d3.select("#map_container").style("height")) - margin*2;

// var width = 960,
//     height = 600;


var projection = d3.geo.albersUsa();
      
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map_container")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2);

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
      .attr("class", function(d) {return "state " + d.id; });
      // .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.us_10m, function(a,b) {return a !== b;}))
    .attr("class", "state-boundary");
    // .attr("d", path);

  svg.append("g")
    .attr("class", "bubbles")
  .selectAll("circle")
    .data(topojson.feature(us, us.objects.us_10m).features)
  .enter().append("circle")
    .attr("class","bubble")
    .attr("text", function(d){ return d.properties.name});
    // .attr("transform", function(d) { 
    // 	return "translate(" + path.centroid(d) + ")"; })
    // .attr("r", function(d) { return radius(d.properties.total)})
    // .attr("text", function(d){ return d.properties.name});


    function resize() {
	    var width = parseInt(d3.select("#map_container").style("width")) - margin*2,
	    height = parseInt(d3.select("#map_container").style("height")) - margin*2;    	
     	// width = $(window).width();

// console.log(path.centroid(d));

     	projection
	     	.scale(width)
	     	.translate([width / 2, height / 2])

    	svg.selectAll('path.state')
    		.attr("d", path);

    	svg.selectAll('path.state-boundary')
    		.attr("d", path);

    	svg.selectAll("circle.bubble")
    		.data(topojson.feature(us, us.objects.us_10m).features
          .sort(function(a, b) { return b.properties.total - a.properties.total; }))
			.attr("transform", function(d) { 
				// console.log(path.centroid(d));
  			return "translate(" + path.centroid(d) + ")"; })
  		.attr("r", function(d) { return radius(d.properties.total)});


	    console.log(width);
	    console.log(height)
    }
   	resize();
    d3.select(window).on('resize', resize); 
    	resize();
	});