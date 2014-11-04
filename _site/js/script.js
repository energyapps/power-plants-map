var margin = 0,
    width = parseInt(d3.select("#master_container").style("width")) - margin*2,
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


var legend = svg.append("g")
    .attr("class", "legend")    
    .selectAll("g")
      .data([1000, 5000, 10000])
      .enter().append("g");

// Pie chart parameters
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var radius = 80;
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(30);

var pie = d3.layout.pie()
    .sort(null)
    .value (function(d){  
    return d.value;   
      // if (d.value > 1) {
      //   return d.value;   
      // };

      //Trying to figure out a way to prune results.
    });

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
    .attr("class","bubble");    
    // .attr("transform", function(d) { 
    // 	return "translate(" + path.centroid(d) + ")"; })
    // .attr("r", function(d) { return radius(d.properties.total)})
    // .attr("text", function(d){ return d.properties.name});


    function resize() {
	    var width = parseInt(d3.select("#master_container").style("width")) - margin*2,
	    height = width / 2;    	
     	// width = $(window).width();

    // Smaller viewport
      // if (width <= 200) {
      //   // var radius2 = d3.scale.sqrt()  
      //   //   .domain([0, 3000])
      //   //   .range([5, 15]);    

      //   // projection
      //   //   .scale(width * 1.1)
      //   //   .translate([width / 2, height / 2])             
      // } 
      // // full viewport
      // else {
      //   var radius2 = d3.scale.sqrt()  
      //     .domain([0, 1000])
      //     .range([(width / 110), (width / 45)]); 

      //   projection
      //     .scale(width)
      //     .translate([width / 2, height / 2])   
      // };

        var radius2 = d3.scale.sqrt()  
          .domain([0, 1000])
          .range([(width / 110), (width / 45)]); 

        projection
          .scale(width)
          .translate([width / 2, height / 2])  

      legend.append("circle")

      legend.append("text")
          .attr("dy", "1.3em")
          .text(d3.format(".1s"));

      legend        
        .attr("transform", "translate(" + (width - 65) + "," + (height - 15) + ")");

      legend.selectAll("circle")
        .attr("cy", function(d) { return -radius2(d); })
        .attr("r", radius2);

      legend.selectAll("text")
        .attr("y", function(d) { return -2 * radius2(d); }); 


    	svg.selectAll('path.state')
    		.attr("d", path);

    	svg.selectAll('path.state-boundary')
    		.attr("d", path);

    	svg.selectAll("circle.bubble")
    		.data(topojson.feature(us, us.objects.us_10m).features
          .sort(function(a, b) { return b.properties.total - a.properties.total; }))
        .attr("transform", function(d) { 
          return "translate(" + path.centroid(d) + ")"; })
        .attr("r", function(d) { return radius2(d.properties.total)})
        .attr("text", function(d){ return d.properties.name});

    }

    function tooltip(d) {     
      width = parseInt(d3.select("#master_container").style("width")) - margin*2,

      // Remove everything and start over.
      remover();
      
      var data = d;
      centroid = path.centroid(data);

      if (width > 700) {  
        if (centroid[1] < 250) {
          centroid_adjusted = [(centroid[0]-radius - 5),(centroid[1]+25)];
        } else {
          centroid_adjusted = [(centroid[0]-radius - 5),(centroid[1]-(2 * radius + 80))];
        };
      }
      else if (width > 480) {
        if (centroid[0] < width / 2) {
          centroid_adjusted = [(width - 175),(5)];        
        } else {
          centroid_adjusted = [(5),(5)];               
        };
      } else {
        if (centroid[0] < 200) {
          centroid_adjusted = [(width - 175),(5)];        
        } else {
          centroid_adjusted = [(5),(5)];               
        };
      };

        tip_text  = [(centroid_adjusted[0] + radius + 5),(centroid_adjusted[1] + 20)];
        tip_text2  = [(centroid_adjusted[0] + radius + 5),(centroid_adjusted[1] + 40)];
        pie_center = [(centroid_adjusted[0] + radius + 5),(centroid_adjusted[1]+(radius + 40))];
        tip_close = [(centroid_adjusted[0] + radius + 5),(centroid_adjusted[1]+(radius + 45))];

// Create array for pie charts here!!!!!!!!!!!!!!!!!!!!!!! put in memory and use laterZZzzzZzzZzzzZZzzZZZz
      var data_array = [{type: "Biofuels", value: data.properties.biofuels, x:centroid_adjusted[0], y:centroid_adjusted[1]},
        {type: "Coal", value: data.properties.coal, x:centroid_adjusted[0], y:centroid_adjusted[1]},
        {type: "Crude", value: data.properties.crude, x:centroid_adjusted[0], y:centroid_adjusted[1]},
        {type: "Natural Gas", value: data.properties.nat_gas, x:centroid_adjusted[0], y:centroid_adjusted[1]},
        {type: "Nuclear", value: data.properties.nuclear, x:centroid_adjusted[0], y:centroid_adjusted[1]},
        {type: "Other Renewable Energy", value: data.properties.o_renew, x:centroid_adjusted[0], y:centroid_adjusted[1]}];
        // {type: "t_renew", value: data.properties.t_renew}];    

      var tooltipContainer = svg.append("g")
        .attr("id", "tooltip")
      .append("rect")
        // .attr("id", "tooltip")
        .attr("transform", function() { 
          return "translate(" + centroid_adjusted + ")"; })
        .attr("width", (radius * 2 + 10))
        .attr("height", (radius * 2 + 65))
        .attr("rx", 6)
        .attr("ry", 6)
        // .attr("fill", "brown");

// tip title
      svg
        .append("text")
        .attr("class","tip-text")
        .text(function(d){
            return data.properties.name;
        })
        .attr("transform", function() { 
          return "translate(" + tip_text + ")"; });

      svg
        .append("text")
        .attr("class","tip-text2")
        .text(function(d){
            return "Total: " + data.properties.total + " BTU";
        })
        .attr("transform", function() { 
          return "translate(" + tip_text2 + ")"; });

      svg.append("g")
        .attr("class", "closer")
        .attr("transform", function(){
          return "translate(" + tip_close + ")";
        })
          .append("text")
          .attr("class", "tip-text2")
          .text("CLOSE").on("click", remover);



var tip_position = [(centroid_adjusted[0] + 85),(centroid_adjusted[1] + 205)];

      var toolbody = svg.append("text")
                      .attr("class","tip-text3")
                      .attr("transform", function() { 
                        return "translate(" + tip_position + ")"; });

          toolbody
            .append("tspan")
            .text("Hover over pie chart ")
            .attr("x",0)
            .attr("y",0);

          toolbody
            .append("tspan")
            .text("for more information")
            .attr("x",0)
            .attr("y",15);
          

// Pie chart

      var g = svg.selectAll(".arc")
          .data(pie(data_array))
        .enter().append("g")
          .attr("class", "arc")
          .attr("transform", function() { 
          return "translate(" + pie_center + ")"; });

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.type); });

      // g.append("text")
      //   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      //   .attr("dy", ".35em")
      //   .style("text-anchor", "middle")
      //   .text(function(d) { return d.data.type; });

      // If its mobile????? move it to the bottom



    d3.selectAll("g.arc").on('mouseover', arctip);      
  }

    function arctip(d) { 
    d3.selectAll(".tip-text3").remove();
       
    var tip_data = d.data

    var tip_position = [(tip_data.x + 85),(tip_data.y + 205)];

       var toolbody = svg
        .append("text")
        .attr("class","tip-text3")
        .attr("transform", function() { 
          return "translate(" + tip_position + ")"; });

      toolbody.append("tspan")
        .text(function(d){
          return tip_data.type + ":"
        })
        .attr("x",0)
        .attr("y",0);

      toolbody.append("tspan")      
        .text(function(d){
            return tip_data.value + " BTU";
        })
        .attr("x",0)
        .attr("y",15);
      }
    // }        centroid_adjusted = [(centroid[0]-radius),(centroid[1]+25)];

    function remover() {
      d3.select("#tooltip").remove();
      d3.selectAll(".arc").remove();
      d3.selectAll(".tip-text").remove();
      d3.selectAll(".tip-text2").remove();        
      d3.selectAll(".tip-text3").remove();     
    }

    function clickMe(){alert("I've been clicked!")}



   	resize();
    d3.select(window).on('resize', resize); 
    d3.selectAll("circle.bubble").on('mouseover', tooltip);
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


