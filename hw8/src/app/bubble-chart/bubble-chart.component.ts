import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
export interface BubblesType { country: string; rate: number; }

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {
  constructor() { }
  ngOnInit() { 
    var margin = { top: 50, left: 50, bottom: 50, right: 50 };
    var width = +d3.select('#chart-svg01').attr('width') - margin.left - margin.right;
    var height = +d3.select('#chart-svg01').attr('height') - margin.top - margin.bottom;
    
    var svg = d3.select('#chart-svg01')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    
    var tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')			
      .style('opacity', 0);

    var pack = d3.pack().size([width, height-50]).padding(3);  
    var color = d3.scaleSequential(d3.interpolateBlues).domain([-1, 4]);

    d3.json('data8_bubble.json').then(function (data: Array<BubblesType>) {
      var nodes = d3.hierarchy({children:data}).sum(function(d:any){ return d.rate;})
      //console.log(nodes)
      var bubble = svg.selectAll('circle')
        .data(pack(nodes).descendants())
        .enter()
        .append('circle')
        .attr('class', 'circle') 
        .attr('cx', function(d) {return d.x;})
        .attr('cy', function(d) { return d.y; })
        .attr('r', function(d) {return d.r; })
        .attr('fill', function(d) {return color(d.depth); })
        .attr('ocacity', 0.35)
        .on('mouseover', function(d:any) {
          d3.select(this)
            .attr('stroke', '#ADADAD')
            .attr('stroke-width', 2)
          if (d.data.country) {
            var country = d.data.country;
            var rate = d.data.rate
            tooltip.transition()		
              .duration(200)		
              .style('opacity', 0.9);		
            tooltip.html(country + '<br/>'  + rate)	
              .style('left', (d3.event.pageX -5) + 'px')		
              .style('top', (d3.event.pageY + 5) + 'px');	  
          }
        })					
        .on('mouseout', function(d) {	
          d3.select(this)
            .attr('stroke-width', 0);	
          tooltip.transition()		
            .duration(500)		
            .style('opacity', 0);	
        })
      
      var text = svg.selectAll('text')
        .data(pack(nodes).descendants())
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', function(d) {return d.x;})
        .attr('y', function(d) { return d.y; })
        .attr('text-anchor','middle')
        .attr('alignment-baseline', 'middle')
        .text(function(d:any) { return d.children ? '' : d.data.country; });
    });			
  }
}