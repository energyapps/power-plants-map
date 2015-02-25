var margin = 0,
    width = parseInt(d3.select("#master_container").style("width")) - margin*2,
    // width = 1000,
    // height = 770;
    height = width / 2;
    // height = parseInt(d3.select("#map_container").style("height")) - margin*2;

// var width = 960,
//     height = 600;


var projection = d3.geo.albersUsa();
      
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map_container")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2);

var radius2 = d3.scale.sqrt()
    .domain([0, 1000])
    .range([10, 25]);
    // .domain([0, 3000])
    // .range([5, 15]);    

// Pie chart parameters //first 4 colors are bluish and fossil/nuclear, last two are renewable. Add a diff for nuclear, tweak??
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);

var radius = 80;


// d3.json("/sites/prod/files/us_10m_topo5.json", function(error, us) {
d3.json("js/data/us_10m_topo_places2.json", function(error, us) {
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
    .data(topojson.feature(us, us.objects.plants_pre).features
      .sort(function(a, b) { return b.properties.capacity - a.properties.capacity; }))
  .enter().append("circle")
    .attr("class", function(d) {
      return "posB bubble"
      // var src = d.properties.source;
      // if (
      //   src === "GEO"
      //   ) {
      //   console.log(src)
      //   return "posB bubble"
      // } else {
      //   return "negB bubble"
      // };      
    }); 


    function resize() {
	    var width = parseInt(d3.select("#master_container").style("width")) - margin*2,
          // width = 1000,
	    // height = 770;    	
     	    height = width / 2;

    // Smaller viewport
      if (width <= 800) {
        projection
          .scale(width * 1.2)
          .translate([width / 2, ((height / 2) + 45)])             
      } else if (width <= 900) {

        projection
          .scale(width * 1.2)
          .translate([width / 2, ((height / 2) + 30)])             
      } 
      // full viewport
      else {
        projection
          .scale(width)
          .translate([width / 2, ((height / 2) - 20)])   
      };

        var radius2 = d3.scale.sqrt()  
          .domain([0, 5000])
          .range([(2), (width / 45)]); 

    	svg.selectAll('path.state')
    		.attr("d", path);

    	svg.selectAll('path.state-boundary')
    		.attr("d", path);

    	svg.selectAll("circle.bubble")
    		.data(topojson.feature(us, us.objects.plants_pre).features)
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; })
        .attr("r",function(d) { 
          
          var src = d.properties.source;
          // if (src === "LFG") {
          if (src != null) {
            if (src === null) {
              console.log('error')
              // return radius2(40)
            } else {
              console.log(src)
              var src2 = src;
              console.log(src2)
              return radius2(d.properties.capacity)
              // return radius2(4)
            };
          };
          

        });
        // .attr("text", function(d){ return d.properties.name});

    }

   	resize();
    d3.select(window).on('resize', resize); 
    // d3.selectAll("circle.bubble").on('click', tooltip);
    // d3.selectAll(".closer")
    //   .selectAll('.tip-text2')
    //   .on('click', clickMe)

       // Doesn't work the below vvvv
    // d3.selectAll("g.arc").on('mouseout', function(){d3.selectAll(".tip-text2").remove();})

    // d3.select("#master_container").on('mouseover', function() {
    //   d3.select("#tooltip").remove();
    //   console.log('h')
    // })
    resize(); 
    // Need both resizes???????
	});


