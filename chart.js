var width = 900,
    height = 500;

var color = d3.scale.threshold()
    .domain([0.01, 0.02, 0.03, 0.04, 0.05])
    .range(["#440154FF", "#404387FF", "#29788EFF", "#22A784FF", "#79D151FF", "#FDE725FF"]);

var path = d3.geo.path();

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "us.json")
    .defer(d3.tsv, "output-onlinetsvtools.tsv")
    .await(ready);

function ready(error, us, unemployment) {
    if (error) throw error;

    var rateById = {};

    unemployment.forEach(function(d) { rateById[d.id] = +d.rate; });
    console.log(rateById);

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return color(rateById[d.id]); });

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
        .attr("class", "states")
        .attr("d", path);
    // #create a legend

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(30, 300)")
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(800," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .data(["<2%", "2-4%", "4-6%", "6-8%", "8-10%", ">10%"])
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
}
