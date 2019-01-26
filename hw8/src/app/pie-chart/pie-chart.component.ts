import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// import { Arc } from 'd3';
// export interface BubblesType { country: string; rate: number; }
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  
  header: any;
  title: any;
  content: any;

  constructor() { 
    this.header = 'Total fertility rate in 2010-2015';
    this.content = 'Total fertility rate is the number of children who would be born per woman. The pie chart shows the rate of Canada, China, France, India and Japan in 2010-2015.'
  }

  ngOnInit() {
    var tmp_this = this;
    
    var margin = { top: 50, left: 50, bottom: 50, right: 50 };
    var width = +d3.select('#chart-svg03').attr('width') - margin.left - margin.right;
    var height = +d3.select('#chart-svg03').attr('height') - margin.top - margin.bottom;

    var svg = d3.select('#chart-svg03')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    var g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    
    var radius = Math.min(width, height) / 2;
    var pie = d3.pie()
            .sort(null)
            .value(function(d:any) { return d.rate; });
    var path:any = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
    var color = d3.scaleSequential(d3.interpolateBlues).domain([-1,8]);

    d3.csv('data8_pie.csv', function(d) {
      return { country: d.country, rate: +d.rate };
    }).then(function(data:any) {
      var arc = g.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .on('mouseover', function(d:any) {
          d3.select(this)
            .select('path')
            .attr('stroke', '#ADADAD')
            .attr('stroke-width', 2)
          tmp_this.header = d.data.country ;
          tmp_this.content = "Total fertility rate is " + d.data.rate + " in 2010-2015.";
        })					
        .on('mouseout', function(d) {	
          d3.select(this)
            .select('path')
            .attr('stroke-width', 0);	
            tmp_this.header = 'Total fertility rate in 2010-2015';
            tmp_this.content = 'Total fertility rate is the number of children who would be born per woman. The pie chart shows the rate of Canada, China, France, India and Japan in 2010-2015.'
        })
        
      arc.append('path')
          .attr('d', path)
          .attr('fill', function(d:any, i) { return color(i); });
          
      arc.append('text')
          .attr('transform', function(d:any) { return 'translate(' + label.centroid(d) + ')'; })
          .attr('dy', '0.35em')
          .text(function(d:any) { return d.data.country; })
          .attr('text-anchor', 'middle');
    });

    
  }
}
