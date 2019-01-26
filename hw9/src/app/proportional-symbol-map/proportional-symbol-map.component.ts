import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-proportional-symbol-map',
  templateUrl: './proportional-symbol-map.component.html',
  styleUrls: ['./proportional-symbol-map.component.css']
})
export class ProportionalSymbolMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var margin = { top: 20, left: 50, bottom: 80, right: 50 };
    var width = parseInt(d3.select('#proportional-symbol-map').style('width')) - margin.left - margin.right;
    var height = parseInt(d3.select('#proportional-symbol-map').style('height')) - margin.top - margin.bottom;
    var svg = d3.select('#proportional-symbol-map')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  
    var color = d3.scaleOrdinal(d3.schemeCategory10)

    var tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')			
      .style('opacity', 0);

    // country data loaded as data
    d3.json('a9.1.json').then(function(data:any) {
        var max = +d3.max(data, function(d:any) { return d.rate; })
        var min = +d3.min(data, function(d:any) { return d.rate; })
        color.domain(data.map(function(d:any) { return d.country; }))
        
        //data join with features
        d3.json('world.geo.json').then(function (json:any) {
          for (var i = 0; i < data.length; i++) {
            var dataCountry = data[i].country;
            var dataRate = data[i].rate;
            for (var j = 0; j < json.features.length; j++) {
              var jsonCountry = json.features[j].properties.name;
              if (dataCountry == jsonCountry) {
                json.features[j].properties.rate = dataRate;
                break;
              }
            }
          }
          var projection = d3.geoEquirectangular().fitSize([width, height], json);
          var path = d3.geoPath().projection(projection);
  
          //data join with features
          svg.append('g')
              .selectAll('path')
              .data(json.features)  
              .enter()
              .append('path')
              .attr('fill', function(d:any) {
                // var rate = d.properties.rate;
                // if (rate) { 
                //   return color(d.properties.name);
                // }
                // else {
                //   return 'white'
                // }
                return "white"
              })
              .attr('stroke', 'black')
              .attr('opacity', 0.9)
              .attr('d', path)

          svg.append('g')
            .selectAll('circle')
            .data(json.features)
            .enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('transform', function(d:any) { return 'translate(' + path.centroid(d) + ')'; })
            .attr('r', function(d:any) { 
              if(d.properties.rate) {
                return 15 * d.properties.rate;
              } else {
                return 0;
            }})
            .attr('fill', function(d:any) { 
              if(d.properties.rate) {
                return "red" ;
            }})
            .attr('opacity', 0.65)
            .on('mouseover', function(d:any) {
              d3.select(this)
              .attr('stroke', '#eee')
              .attr('stroke-width', 2)
              var rate = d.properties.rate;
              if (rate) {
                tooltip.transition()		
                  .duration(100)		
                  .style('opacity', 0.9);		
                tooltip.html(d.properties.name + '<br/>'  + d.properties.rate)	
                  .style('left', (d3.event.pageX - 15) + 'px')		
                  .style('top', (d3.event.pageY + 15) + 'px');	  
              }
            })
            .on('mouseout', function(d) {	
              d3.select(this)
                .attr('stroke-width', 0);	
              tooltip.transition()		
                .duration(500)		
                .style('opacity', 0);	
            });  
            
          svg.append('g')
            .selectAll('text')
            .data(json.features)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', function(d:any) { return path.centroid(d)[0]; })
            .attr('y', function(d:any) { return path.centroid(d)[1]; })
            .text(function(d:any) { 
              if (d.properties.rate) return d.properties.name;
            })
            .attr('text-anchor','middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', 'black')
           
          // legend
          var f = d3.format('.1f');
          var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (60) + ',' + (height + 60) + ')')
            .selectAll('g')
            .data([min, (min+max)/2, max])
            .enter()
            .append('g')
          legend.append('circle')   
            .attr('cy', function(d) { return -15 * d; })
            .attr('r', function(d) { return 15 * d; })
            .attr('stroke' ,'black')
            .attr('opacity', 0.5)
            .attr('fill', 'none')
          legend.append('text')
            .attr('y', function(d) { return -30 * d; })
            .attr('dy', '1em')
            .text(function(d) { return f(d); })
            .attr('font-size', '10px')
            .attr('text-anchor','middle')
          legend.append('text')
            .text('Total Fertility Rate')
            .attr('x', -60)
            .attr('y', -180)
        });
    });
  }
}
