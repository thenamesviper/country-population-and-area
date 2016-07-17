"use strict";function drawScatterPlot(t){console.log("drawing"),console.log(t[0]);var a=d3.min(t,function(t){return t.population}),e=d3.max(t,function(t){return t.population}),r=d3.min(t,function(t){return t.area}),n=d3.max(t,function(t){return t.area}),o=d3.min(t,function(t){return Math.abs(t.yearlyChange)}),l=d3.max(t,function(t){return t.yearlyChange});console.log(a,e,r,n),xScale.domain([.9*a,1.1*e]);var i=d3.axisBottom(xScale).ticks(6,",d").tickPadding(10);svg.append("g").attr("class","x axis").attr("transform","translate(0,"+(h-margin.bottom)+")").call(i).append("text").attr("class","label").attr("transform","translate("+(margin.left+w/2)+",75)").text("Population"),yScale.domain([r,1.1*n]);var s=d3.axisLeft(yScale).tickPadding(10).ticks(6,",d");svg.append("g").attr("class","y axis").attr("transform","translate("+margin.left+",0)").call(s).append("text").attr("class","label").attr("transform","translate(-100,"+(h/2-margin.top)+") rotate(-90)").text("Area (Square Kilometers)");var c=d3.scaleLinear().domain([o,l]).range([-.04*t.length+13,-.04*t.length+18]),g=svg.selectAll("circle").data(t).enter().append("circle");g.attr("cx",function(t){return xScale(t.population)}).attr("cy",function(t){return yScale(t.area)}).attr("r",function(t){return c(Math.abs(t.yearlyChange))}).attr("pop",function(t){return t.population}).attr("class",function(t){return t.yearlyChange<0?"low-growth circle":t.yearlyChange>2?"big-growth circle":"medium-growth circle"}).on("mouseenter",function(t){d3.select("#tooltip").style("display","block").transition().duration(300).style("top",event.pageY-50+"px").style("left",event.pageX-205+"px");d3.select("#country-name").text(t.name),d3.select("#area").text(t.area.toLocaleString()),d3.select("#population").text(t.population.toLocaleString()),d3.select("#change").text(t.yearlyChange),d3.select("#density").text(t.density)}).on("mouseout",function(t){d3.select("#tooltip").style("display","none")})}$(document).ready(function(){$("#sources-toggle, #sources").click(function(){$("#sources").toggle()})});var margin={top:75,right:25,bottom:25,left:150},h=900,w=1200,xScale=d3.scaleLog().range([margin.left,w+margin.left]),yScale=d3.scaleLog().range([h-margin.bottom,margin.top]),svg=d3.select("#scatterplot").attr("height",h+margin.top+margin.bottom).attr("width",w+margin.left+margin.right);svg.append("text").attr("id","title").text("Population and Area of Countries").attr("transform","translate(400,50)"),svg.append("text").attr("class","big-growth").text("Growth Rate > 2").attr("transform","translate("+(w-margin.right)+", 700)"),svg.append("text").attr("class","medium-growth").text("Growth Rate 0 < x <= 2").attr("transform","translate("+(w-margin.right)+", 725)"),svg.append("text").attr("class","low-growth").text("Growth Rate < 0").attr("transform","translate("+(w-margin.right)+", 750)"),d3.tsv("./data/countries.tsv",function(t,a){if(t)throw t;a.forEach(function(t){t.name=t["Country (or dependency)"],t.population=parseInt(t["Population(2016)"].replace(/,/g,"")),t.yearlyChange=+t.YearlyChange.replace(/\s%/,""),t.density=parseInt(t["Density(P/Km²)"].replace(/,/g,"")),t.area=parseInt(t["Area(Km²)"].replace(/,/g,""))}),drawScatterPlot(a)});