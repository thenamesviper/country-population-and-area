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

let svg = d3.select('#scatterplot')
    .attr('height', h + margin.top + margin.bottom)
    .attr('width', w + margin.left + margin.right)

//need to fix all of these texts
svg.append('text')
    .attr('id', 'title')
    .text('Population and Area of Countries')
    .attr('transform', 'translate(400,50)')

svg.append('text')
    .attr('class', 'big-growth')
    .text('Growth Rate > 2')
    .attr('transform', 'translate(' + (w - margin.right) + ', 700)')
    
svg.append('text')
    .attr('class', 'medium-growth')
    .text('Growth Rate 0 < x <= 2')
    .attr('transform', 'translate(' + (w - margin.right) + ', 725)')

svg.append('text')
    .attr('class', 'low-growth')
    .text('Growth Rate < 0')
    .attr('transform', 'translate(' + (w - margin.right) + ', 750)')

// let brush = d3.brush()
//     .on("end", brushed)
    
// svg.append("g")
//     .attr("class", "brush")
//     .call(brush)
    
// function brushed() {
    
// }

d3.tsv('./data/countries.tsv', function (error, data) {
    if (error) throw error;

    //this gives things better names and formats the numbers without commas
    data.forEach(function (d) {
        // d.rank = parseInt(d["#"]);
        d.name = d['Country (or dependency)'];
        d.population = parseInt(d['Population(2016)'].replace(/,/g, ''));
        d.yearlyChange = +d['YearlyChange'].replace(/\s%/, '');
        d.density = parseInt(d['Density(P/Km²)'].replace(/,/g, ''));
        d.area = parseInt(d['Area(Km²)'].replace(/,/g, ''));
        // d.worldShare = parseInt(d["WorldShare"]);
    })
    drawScatterPlot(data)
})

function drawScatterPlot(data) {    
    console.log('drawing')
    console.log(data[0]);
    let smallestPopulation = d3.min(data, d => d.population)
    let biggestPopulation = d3.max(data, d => d.population)
    
    let smallestArea = d3.min(data, d => d.area);
    let biggestArea = d3.max(data, d => d.area)

    let smallestChange = d3.min(data, d => Math.abs(d.yearlyChange))
    let biggestChange = d3.max(data, d => d.yearlyChange)
    console.log(smallestPopulation, biggestPopulation, smallestArea, biggestArea)
    
    xScale.domain([smallestPopulation * .9, biggestPopulation * 1.1]);

    let xAxis = d3.axisBottom(xScale)
        .ticks(6, ',d')
        .tickPadding(10)

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (h - margin.bottom) + ')')
        .call(xAxis)

        .append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(' + (margin.left + w / 2) + ',' + 75 + ')')
        .text('Population')
    
    yScale.domain([smallestArea, biggestArea * 1.1]);

    let yAxis = d3.axisLeft(yScale)
        .tickPadding(10)
        .ticks(6, ',d')
    
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(yAxis)

        .append('text')
        .attr('class', 'label')
        .attr('transform', 'translate(' + -100 + ',' + (h / 2 - margin.top) + ') rotate(-90)')
        .text('Area (Square Kilometers)')

    //resize dots when there are more of them..this looks decent
    let rScale = d3.scaleLinear()
        .domain([smallestChange, biggestChange])
        .range([(-.04 * data.length + 13), (-.04 * data.length + 18)])
    
    let circle = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
    
    circle.attr('cx', d => xScale(d.population))
        .attr('cy', d => yScale(d.area))
        .attr('r', d => rScale(Math.abs(d.yearlyChange)))
        .attr('pop', d => d.population)
        .attr('class', function (d) {
            if (d.yearlyChange < 0) {
                return 'low-growth circle';
            } else if (d.yearlyChange > 2) {
                return 'big-growth circle';
            } else {
                return 'medium-growth circle';
            }
        })
        .on('mouseenter', function (d) {
            //only one tooltip on page..display:none when not in circle
            let tooltip = d3.select('#tooltip')
                //this gives an unintended effect in which the tooltip moves from the last
                //selected to the new one. I think it actually looks pretty cool, but I'm
                //not sure if it's right for this graph
                .style('display', 'block')
                .transition()
                .duration(300)

                .style('top', event.pageY - 50 + 'px')
                .style('left', event.pageX - 205 + 'px')
                
            //this sets all properties for the tooltip created in index.html
            //probably not the best way to do it, but seems fairly clean
            d3.select('#country-name').text(d.name)
            d3.select('#area').text(d.area.toLocaleString())
            d3.select('#population').text(d.population.toLocaleString())
            d3.select('#change').text(d.yearlyChange)
            d3.select('#density').text(d.density)
                  
        })
        .on('mouseout', function (d) {
            d3.select('#tooltip')
                .style('display', 'none')
        })
    // svg.selectAll("text.country-name")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .attr("class", "country-name")
    //     .attr("x", function (d) { console.log("hi"); return xScale(d.population) })
    //     .attr("y", function (d) { return yScale(d.area) })

    //     .text(function(d) { return d.name})
}




