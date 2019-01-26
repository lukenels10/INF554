var margin = { top: 70, left: 80, bottom: 80, right: 80 };
var width = 900 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var x = d3.scaleBand();
var y = d3.scaleLinear();

var dataset, all, mode;
var xAxis, yAxis;
var sort;

d3.json("data_a7.json").then(function(data){
    dataset = data;
    all = data;
    dataset.sort(function(a, b) { return d3.ascending(a.country, b.country); });
    drawBars();
    sort = "alphabetical";
    mode = "all";
});

//sort bars
d3.select("#reset")
    .on("click", function () {
        dataset = all;
        sort = "alphabetical";
        mode = "all";
        x.domain(dataset.sort(
            function(a, b) { return d3.ascending(a.country, b.country); }
        ).map(function (d) { return d.country; }));
        filterBars();
    });
d3.select("#country_alphabetical")
    .on("click", function () {
        sort = "alphabetical";
        x.domain(dataset.sort(
            function(a, b) { return d3.ascending(a.country, b.country); }
        ).map(function (d) { return d.country; }));
        transitionBars();
    });
d3.select("#rate_ascending")
    .on("click", function () {
        sort = "ascending";
        x.domain(dataset.sort(
            function(a, b) { return d3.ascending(a.rate, b.rate); }
        ).map(function (d) { return d.country; }));
        transitionBars();
    });
d3.select("#rate_descending")
    .on("click", function () {
        sort = "descending";
        x.domain(dataset.sort(
            function(a, b) { return d3.descending(a.rate, b.rate); }
        ).map(function (d) { return d.country; }));
        transitionBars();
    });

// filter bars
d3.select("#all10")
    .on("click", function () {
        mode = "all"
        dataset = all.sort(
            function(a, b) { return d3.descending(a.rate, b.rate); }
        ).slice(0, 10);
        
        if (sort === "alphabetical") {
            dataset.sort(function(a, b) { return d3.ascending(a.country, b.country); })
        } else if (sort === "ascending") {
            dataset.sort(function(a, b) { return d3.ascending(a.rate, b.rate); })
        } else if (sort === "descending") {
            dataset.sort(function(a, b) { return d3.descending(a.rate, b.rate); })
        }
        
        filterBars();
});

d3.select("#top5")
    .on("click", function () {
        mode = "top 5"
        dataset = all.sort(
            function(a, b) { return d3.descending(a.rate, b.rate); }
        ).slice(0, 5);
        
        if (sort === "alphabetical") {
            dataset.sort(function(a, b) { return d3.ascending(a.country, b.country); })
        } else if (sort === "ascending") {
            dataset.sort(function(a, b) { return d3.ascending(a.rate, b.rate); })
        } else if (sort === "descending") {
            dataset.sort(function(a, b) { return d3.descending(a.rate, b.rate); })
        }

        filterBars();
});

d3.select("#bottom5")
    .on("click", function () {
        //setMode("#bottom5");
        mode = "bottom 5"
        dataset = all.sort(
            function(a, b) { return d3.descending(a.rate, b.rate); }
        ).slice(5, 10);

        if (sort === "alphabetical") {
            dataset.sort(function(a, b) { return d3.ascending(a.country, b.country); })
        } else if (sort === "ascending") {
            dataset.sort(function(a, b) { return d3.ascending(a.rate, b.rate); })
        } else if (sort === "descending") {
            dataset.sort(function(a, b) { return d3.descending(a.rate, b.rate); })
        }

        filterBars();
});


function filterBars() {
    //update scale
    x.domain(dataset.map(function (d) { return d.country; }));

    ////////////////////////////////
    // DATA JOIN FOR BARS.
    var bars = svg.selectAll(".bar")
        .data(dataset, function (d) { return d.country; });

    // UPDATE + ENTER.
    bars.enter().append("rect")
        .attr("x", function (d) { return x(d.country); })
        .attr("y", function (d) { return y(d.rate); })
        .merge(bars)
        .transition()
        .duration(750)
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.country); })
        .attr("y", function (d) { return y(d.rate); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.rate); });

    // EXIT.
    bars.exit()
        .transition()
        .duration(750)
        .style("opacity", 0)
        .remove();

    ////////////////////////////////
    // DATA JOIN FOR NAMES.
    var labels = svg.selectAll(".label")
        .data(dataset, function (d) { return d.country; });

    // UPDATE.
    labels.transition()
        .duration(750)
        .attr("x", function (d, i) { return x(d.country) + x.bandwidth() / 2; });

    // ENTER.
    labels.enter().append("text")
        .attr("x", function (d) { return x(d.country) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.rate) + (height - y(d.rate)) / 2; })
        .style("opacity", 0)
        .transition()
        .duration(750)
        .text(function (d) { return d.country; })
        .attr("class", "label")
        .attr("x", function (d) { return x(d.country) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.rate) + (height - y(d.rate)) / 2; })
        .style("opacity", 1);

    // EXIT.
    labels.exit()
        .transition()
        .duration(750)
        .style("opacity", 0)
        .remove();

    ////////////////////////////////
    // x_axis.                 
    xAxis = d3.axisBottom()
        .scale(x);
    svg.select(".x_axis")
        .transition()
        .duration(750)
        .call(xAxis)
        .selectAll('text')  
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(25)');
    // y_axis. 
    svg.select(".y_axis")
        .call(yAxis);

    ////////////////////////////////
    // title.   
    var titles = svg.select(".title")              
        .transition()
        .duration(750)
        .text("Total fertility rate of " + mode +  " countries in " + sort + " order")
}

function transitionBars() {
    var transition = svg.transition()
        .duration(750);

    transition.selectAll(".bar")
        .attr("x", function (d) {
            return x(d.country);
        });

    transition.selectAll(".label")
        .attr("x", function (d) {
            return x(d.country) + x.bandwidth() / 2;
        });

    transition.select(".x_axis").call(xAxis);
    transition.select(".y_axis").call(yAxis);
    
    transition.select(".title")
        .text("Total fertility rate of " + mode +  " countries in " + sort + " order");
}

function drawBars() {
    x.domain(dataset.map(function (d) { return d.country; }))
        .range([0, width])
        .padding(0.05);

    y.domain([0, d3.max(dataset, function (d) { return d.rate; })])
        .range([height, 0]);

    svg.selectAll(".bar")
        .data(dataset, function (d) { return d.country; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.country); })
        .attr("y", function (d) { return y(d.rate); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.rate); });

    svg.selectAll(".label")
        .data(dataset, function (d) { return d.country; })
        .enter().append("text")
        .text(function (d) { return d.country; })
        .attr("class", "label")
        .attr("x", function (d) { return x(d.country) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.rate) + (height - y(d.rate)) / 2; });

    //xAxis;
    xAxis = d3.axisBottom()
        .scale(x);

    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(25)');

    svg.append("text")
        .attr("class", "xlabel")
        .text("country")
        .attr("x", width/2)
        .attr("y", height + 70)
        .style("baseline-shift", "nomal")

    //yAxis;
    yAxis = d3.axisLeft()
        .scale(y)
        .ticks(5, 'd');

    svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis);

    svg.append("text")
        .attr('class', 'ylabel')
        .text("rate")
        .attr("x", - height / 2)
        .attr("y", - margin.left * 0.7)
        .attr("transform", "rotate(-90)")
        .style("baseline-shift", "nomal")
    
    //title
    svg.append("text")
        .attr("class", "title")
        .text("Total fertility rate of all countries in alphabetical order")
        .attr("x", width/2)
        .attr("y", -20)
        .style("baseline-shift", "nomal")
}
