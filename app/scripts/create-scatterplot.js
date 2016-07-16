let margin = {
    top: 75,
    right: 25,
    bottom: 25,
    left: 150
}

//refer to chart values, range of data only..svg-margins
let h = 900, w = 1200;

//population scale
let xScale = d3.scaleLog()    
    .range([margin.left, w + margin.left])
 
//area scale
let yScale = d3.scaleLog()    
    .range([h-margin.bottom, margin.top])


let svg = d3.select("#scatterplot")
    .attr("height", h + margin.top + margin.bottom)
    .attr("width", w + margin.left + margin.right)
    .style("border", "1px solid red")

d3.tsv("./data/countries.tsv", function (error, data) {
    if (error) throw error;
    
    //this gives things better names and formats the numbers without commas
    data.forEach(function (d) {
        d.rank = parseInt(d["#"]);
        d.name = d["Country (or dependency)"];
        d.population = parseInt(d["Population(2016)"].replace(/,/g, ''));
        d.yearlyChange = +d["YearlyChange"].replace(/\s%/, "");
        d.density = parseInt(d["Density(P/Km²)"].replace(/,/g, ''));
        d.area = parseInt(d["Area(Km²)"].replace(/,/g, ''));
        d.worldShare = parseInt(d["WorldShare"]);
    })
    
    let smallestPopulation = d3.min(data, function (d) {
        return d.population;
    })    
    let biggestPopulation = d3.max(data, function (d) {
        return d.population;
    })
    
    let smallestArea = d3.min(data, function (d) {
        return d.area;
    });
    let biggestArea = d3.max(data, function (d) {
        return d.area;
    })

    let smallestChange = d3.min(data, function (d) {
        return Math.abs(d.yearlyChange);
    })
    let biggestChange = d3.max(data, function (d) {
        return Math.abs(d.yearlyChange);
    })

    // let smallestDensity = d3.min(data, function (d) {
    //     return d.density;
    // })
    // let biggestDensity = d3.max(data, function (d) {
    //     return d.density;
    // })

    // let quartileDensity = .25*(biggestDensity - smallestDensity);

    //all domains based on data values
    xScale.domain([smallestPopulation * .9, biggestPopulation * 1.1]);

    let xAxis = d3.axisBottom(xScale)
        .ticks(6, ",d")
        .tickPadding(10)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h-margin.bottom) + ")")
        .call(xAxis)

        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + (margin.left + w/2) + "," + 75+ ")")
        .text("Population")
    

    yScale.domain([smallestArea, biggestArea * 1.1]);

    let yAxis = d3.axisLeft(yScale)
        .tickPadding(10)
        .ticks(6, ",d")
    
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)

        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + -100 + "," + (h/2 - margin.top) + ") rotate(-90)")
        .text("Area (Square Kilometers)")   

    //resize dots when there are more of them..this looks decent
    let rScale = d3.scaleLinear()
        .domain([smallestChange, biggestChange])
        .range([(-.04*data.length+10), (-.04*data.length+15)])
    
    let circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
    
    circle.attr("cx", function (d) {
        return xScale(d.population);
        })
        .attr("cy", function (d) {
            return yScale(d.area);
        })
        .attr("r", function (d) {
            return rScale(Math.abs(d.yearlyChange));
        })
        .attr("pop", function (d) {
            return d.population
        })
        .style("fill", function (d) {
            if (d.yearlyChange < .5) {
                return "red";
            } else if (d.yearlyChange > 2) {
                return "green";
            } else {
                return "yellow";
            }
        })
        .on("mouseenter", function(d) { console.log(d)})
})


    
svg.append("text")
    .attr("id", "title")
    .text("Population and Area of the 25 Largest Countries")
    .attr("transform", "translate(315,50)")

