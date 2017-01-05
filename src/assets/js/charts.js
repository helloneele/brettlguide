 (function(d3) {
        'use strict';

        var dataset = [
          { label: 'Blau', count: 7 },
          { label: 'Rot', count: 4 },
          { label: 'Schwarz', count: 2 },
        
        ];

        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;                            
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scaleOrdinal()
  .range(['#295e72', '#722929', '#333']);

        var svg = d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(radius - donutWidth)             // UPDATED
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d.count; })
          .sort(null);

        var tooltip = d3.select('#chart')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip');                                    // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'label');                                      // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'count');                                      // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'percent');                                    // NEW


        var path = svg.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(d.data.label);
              })                                                        // UPDATED (removed semicolon)
            .each(function(d) { this._current = d; });  

           path.on('mouseover', function(d) {                            // NEW
            var total = d3.sum(dataset.map(function(d) {                // NEW
        return (d.enabled) ? d.count : 0;                                         // NEW
            }));                                                        // NEW
            var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
            tooltip.select('.label').html(d.data.label);                // NEW
            tooltip.select('.count').html("Anzahl: "+d.data.count);                // NEW           // NEW
            tooltip.style('display', 'block');                          // NEW
          });                                                           // NEW

          path.on('mouseout', function() {                              // NEW
            tooltip.style('display', 'none');                           // NEW
          });                                                           // NEW

         var legend = svg.selectAll('.legend')                     
          .data(color.domain())                                   
          .enter()                                                
          .append('g')                                            
          .attr('class', 'legend')                                
          .attr('transform', function(d, i) {                    
            var height = legendRectSize + legendSpacing;          
            var offset =  height * color.domain().length / 2;     
            var horz = -2 * legendRectSize;                       
            var vert = i * height - offset;                       
            return 'translate(' + horz + ',' + vert + ')';        
          });                                                     

        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize)                         
          .style('fill', color)                                   
           .style('stroke', color)                                   
            .on('click', function(label) {                            
              var rect = d3.select(this);                             
              var enabled = true;                                     
              var totalEnabled = d3.sum(dataset.map(function(d) {     
                return (d.enabled) ? 1 : 0;                           
              }));                                                    

              if (rect.attr('class') === 'disabled') {                
                rect.attr('class', '');                               
              } else {                                                
                if (totalEnabled < 2) return;                         
                rect.attr('class', 'disabled');
                enabled = false;                                      
              }                                                       

              pie.value(function(d) {                                 
                if (d.label === label) d.enabled = enabled;           
                return (d.enabled) ? d.count : 0;                     
              });                                                     

              path = path.data(pie(dataset));                         

              path.transition()                                       
                .duration(750)                                        
                .attrTween('d', function(d) {                         
                  var interpolate = d3.interpolate(this._current, d); 
                  this._current = interpolate(0);                     
                  return function(t) {                                
                    return arc(interpolate(t));                       
                  };                                                  
                });                                                   
            });                                                       


        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', legendRectSize - legendSpacing)              
          .text(function(d) { return d; });                      




      })(window.d3);