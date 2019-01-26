import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.css']
})
export class ChoroplethMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var margin = { top: 100, left: 50, bottom: 0, right: 50 };
    var width = parseInt(d3.select("#horopleth-map").style('width')) - margin.left - margin.right;
    var height = parseInt(d3.select("#horopleth-map").style('height')) - margin.top - margin.bottom;
    var svg = d3.select('#horopleth-map')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')') 

    var tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip_map2')			
      .style('opacity', 0);
      
    var color = d3.scaleSequential(d3.interpolateRdYlGn)
    
    // country data loaded as data
    d3.json("a9.1.json").then(function(data:any) {
        var max = +d3.max(data, function(d:any) { return d.rate; })
        var min = +d3.min(data, function(d:any) { return d.rate; })
        data.sort(function(a, b) { return d3.ascending(a.rate, b.rate) }); 
        color.domain([min, max]);
        // world data loaded as json
        d3.json("world.geo.json").then(function (json:any) {
          for (var i = 0; i < data.length; i++) {
            var dataCountry = data[i].country;
            var dataRate = data[i].rate;
            for (var j = 0; j < json.features.length; j++) {
              var jsonCountry = json.features[j].properties.name;
              if(dataCountry == jsonCountry) {
                json.features[j].properties.rate = dataRate;
                break;
              }
            }
          }
          var projection = d3.geoEquirectangular().fitSize([width, height], json);
          var path = d3.geoPath().projection(projection);
          
          //data join with features
          svg.append("g")
              .selectAll("path")
              .data(json.features)  
              .enter()
              .append("path")
              .attr("class", "country")
              .attr("fill", function(d:any){
                var rate = d.properties.rate;
                if(rate) { 
                  return color(rate);
                }
                else {
                  return "white"
                }
              })
              .attr("stroke", "black")
              .attr("opacity", 0.9)
              .attr("d", path)
              .on('mouseover', function(d:any) {
                var rate = d.properties.rate;
                if (rate) {
                  tooltip.transition()		
                    .duration(200)		
                    .style('opacity', 0.9);		
                  tooltip.html(d.properties.rate)	
                    .style('left', (d3.event.pageX -5) + 'px')		
                    .style('top', (d3.event.pageY + 5) + 'px');	  
                }
              })
              .on('mouseout', function(d) {	
                tooltip.transition()		
                  .duration(500)		
                  .style('opacity', 0);	
              });
        
          svg.append("g")
            .selectAll("text")
            .data(json.features)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", function(d:any) { return path.centroid(d)[0]; })
            .attr("y", function(d:any) { return path.centroid(d)[1]; })
            .text(function(d:any) { 
              if(d.properties.rate) return d.properties.name;
            })
            .attr('text-anchor','middle')
            .attr('alignment-baseline', 'middle')
            .attr("fill", "black")
        
        // legend
        var g = svg.append("g")
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d,i) => 600 + i * 50)
          .attr("y", -30)
          .attr("width", 50)
          .attr("height", 10)
          .attr("fill", function(d:any) { return color(d.rate) })
          .attr("stroke", "gray")
          .attr("opacity", 0.9);

        g.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .text(function(d:any) { return d.country})
          .attr("class", "legend")
          .attr("x", (d,i) => 610 + i * 50)
          .attr("y", -10)
          .attr('text-anchor', 'start')
          .attr('transform', (d,i)=>{
            return 'rotate(45, ' + (610 + i * 50) + ' -10)'
          })           
        });
    });
  }

}
