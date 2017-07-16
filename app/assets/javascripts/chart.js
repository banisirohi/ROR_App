/**
 * Created by banikasirohi on 12/07/17.
 * Css for bar chart
 * Binds chart to div having id="chart"
 */
function draw(data) {
    $('#chart').empty();
    $('#chart').append("<h5>Recent Price Trend Per Stock</h5>");
// set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

// set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// format the data
    data.forEach(function(d) {
        d.price = +d.price;
    });

// Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.symbol; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);

// append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.symbol); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.price); })
        .attr("height", function(d) { return height - y(d.price); });

// add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

// add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}