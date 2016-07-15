let margin = {
    top: 75,
    right: 150,
    bottom: 75,
    left: 150
}

let svgH = 700, svgW = 1200;

//population scale
let xScale = d3.scaleLog()   
    .range([margin.left, svgW + margin.right])
 
//area scale
let yScale = d3.scaleLog()  
    .range([svgH-margin.bottom, margin.top])

let rScale = d3.scaleLinear()
    .domain([-.5, 3.5])
    .range([3, 12])
    
let svg = d3.select("#scatterplot")
    .attr("height", svgH + margin.top + margin.bottom)
    .attr("width", svgW + margin.left + margin.right)
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
        return +d.population;
    })    
    let biggestPopulation = d3.max(data, function (d) {
        return +d.population;
    })
    
    let smallestArea = d3.min(data, function (d) {
        return +d.area;
    });
    let biggestArea = d3.max(data, function (d) {
        return +d.area;
    })
    
    //need to allow this all to be dynamic so more countries can be added in
    xScale.domain([50000000, 1900000000]);
    let xAxis = d3.axisBottom(xScale)
        .ticks(10, ",d")
        .tickPadding(10)
        .tickValues([50000000, 75000000,100000000,250000000,500000000,1000000000,1500000000])

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (svgH-margin.bottom +10) + ")")
        .call(xAxis)

        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(750,75)")
        .text("Population")
    

    yScale.domain([smallestArea, 20000000]);
    let yAxis = d3.axisLeft(yScale)
        .tickPadding(10)
        .ticks(8, ",d")
        .tickValues([200000,300000,500000, 1000000,4000000,10000000,20000000])

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)

        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(-115,225) rotate(-90)")
        .text("Area (Square Kilometers)")
    
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
            return rScale(d.yearlyChange);
        })
        .attr("pop", function (d) {
            return d.population
        })
        .style("fill", function (d) {
            if (d.yearlyChange < 0) {
                return "red";
            } else if (d.yearlyChange > 1.5) {
                return "green";
            } else {
                return "yellow";
            }
        })
})

svg.append("text")
    .attr("id", "title")
    .text("Population and Area of the 25 Largest Countries")
    .attr("transform", "translate(315,50)")

