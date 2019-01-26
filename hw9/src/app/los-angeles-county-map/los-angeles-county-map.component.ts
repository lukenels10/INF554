import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-los-angeles-county-map',
  templateUrl: './los-angeles-county-map.component.html',
  styleUrls: ['./los-angeles-county-map.component.css']
})
export class LosAngelesCountyMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var margin = { top: 20, left: 50, bottom: 0, right: 50 };
    var width = parseInt(d3.select('#los-angeles-county-map').style('width')) - margin.left - margin.right;
    var height = parseInt(d3.select('#los-angeles-county-map').style('height')) - margin.top - margin.bottom;

    var svg = d3.select('#los-angeles-county-map')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
  
    var tooltip = d3.select('body')
    .append('div')
    .attr('id', 'la_tooltip')			
    .style('opacity', 0);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    
    d3.json('la.json').then(function (json:any) {
      var projection = d3.geoEquirectangular().fitSize([width, height], json);
      var path = d3.geoPath().projection(projection);
      //data join with features
      svg.append('g')
          .selectAll('path')
          .data(json.features)  
          .enter()
          .append('path')
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('opacity', 0.5)
          .attr('d', path);  //generate geographic path
          
          d3.json('bookstore.json').then(function (data:any) {
            var projection = d3.geoEquirectangular().fitSize([width, height], json);
            var path = d3.geoPath().projection(projection);
            svg.append('g')
              .selectAll('circle')
              .data(data.features)
              .enter()
              .append('circle')
              .attr('cx', function(d:any) { 
                if (d.geometry) {
                  var marker = projection(d.geometry.coordinates);
                  return marker[0];
                }
                return 0; 
              })
              .attr('cy', function(d:any) { 
                if (d.geometry) {
                  var marker = projection(d.geometry.coordinates);
                  return marker[1];
                }
                return 0; 
              })
              .attr('r', function(d:any) { 
                if (d.geometry) {
                  return 3;
                }
                return 0; 
              })
              .attr('fill', 'red')
              .attr('stroke', '#eee')
              .attr('opacity', 0.65)
              .on('mouseover', function(d:any) {
                var bookstore = d.properties.bookstore;
                if (bookstore) {
                  tooltip.transition()		
                    .duration(200)		
                    .style('opacity', 0.9);		
                  tooltip.html(bookstore)	
                    .style('left', (d3.event.pageX -5) + 'px')		
                    .style('top', (d3.event.pageY + 5) + 'px');	  
                }
              })
              .on('mouseout', function(d) {	
                tooltip.transition()		
                  .duration(500)		
                  .style('opacity', 0);	
              });
              
            var legend = svg.append('g')
            legend.append('circle')
              .attr('cx', 20)
              .attr('cy', 250)
              .attr('r', 3)
              .attr('fill', 'red')
              .attr('stroke', '#eee')
              .attr('opacity', 0.65)
            legend.append('text')
              .attr('x', 30)
              .attr('y', 255)
              .text("bookstore")             
          });
    });
  }
}
