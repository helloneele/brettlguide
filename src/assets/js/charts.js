import * as d3 from "d3"

export function averageUtilization() {
  let auslastung = Math.floor((Math.random() * 95) + 5)

  let colors = {
    'darkblue': '#295e72',
    'skyblue': '#4bb4ca'
  };

  let color = colors.darkblue;

  let radius = document.getElementsByClassName("auslastung")[0].parentElement.offsetWidth/2;
  let border = 10;
  let padding = 0;
  let startPercent = 0;
  let endPercent = auslastung/100;


  let twoPi = Math.PI * 2;
  let formatPercent = d3.format('.0%');
  let boxSize = radius * 2;


  let count = Math.abs((endPercent - startPercent) / 0.01);
  let step = endPercent < startPercent ? -0.01 : 0.01;

  let arc = d3.arc()
  .startAngle(0)
  .innerRadius(radius)
  .outerRadius(radius - border);

  let parent = d3.select('.auslastung');

  let svg = parent.append('svg')
  svg.attr('width', document.getElementsByClassName("auslastung")[0].parentElement.offsetWidth)
  svg.attr('height', document.getElementsByClassName("auslastung")[0].parentElement.offsetWidth);

  let defs = svg.append('defs');



  let g = svg.append('g')
  .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

  let meter = g.append('g')
  .attr('class', 'progress-meter');

  meter.append('path')
  .attr('class', 'background')
  .attr('fill', '#ccc')
  .attr('fill-opacity', 0.5)
  .attr('d', arc.endAngle(twoPi));

  let foreground = meter.append('path')
  .attr('class', 'foreground')
  .attr('fill', color)
  .attr('fill-opacity', 1)
  .attr('stroke', color)
  .attr('stroke-width', 5)
  .attr('stroke-opacity', 1)
  .attr('filter', 'url(#blur)')

  let front = meter.append('path')
  .attr('class', 'foreground')
  .attr('fill', color)
  .attr('fill-opacity', 1)

  let numberText = meter.append('text')
  .attr('fill', '#757575')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')

  function updateProgress(progress) {
    foreground.attr('d', arc.endAngle(twoPi * progress))
    front.attr('d', arc.endAngle(twoPi * progress))
    numberText.text(formatPercent(progress))
  }

  let progress = startPercent;

  (function loops() {
    updateProgress(progress)

    if (count > 0) {
      count--
      progress += step
      setTimeout(loops, 10)
    }
  })();
}

//Schwierigkeitsstufen
export function slopeDifficulty() {
  let dataset = [
  { label: 'Blau', count: 7 },
  { label: 'Rot', count: 4 },
  { label: 'Schwarz', count: 2 }
  ]

  let width = document.getElementsByClassName("pisten")[0].parentElement.offsetWidth
  let height = document.getElementsByClassName("pisten")[0].parentElement.offsetWidth
  let radius = Math.min(width, height) / 2
  let donutWidth = 75
  let legendRectSize = 18
  let legendSpacing = 4

  let color = d3.scaleOrdinal()
  .range(['#295e72', '#722929', '#333'])

  let svg = d3.select('.pisten')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + (width / 2) +
    ',' + (height / 2) + ')')

  let arc = d3.arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius)

  let pie = d3.pie()
  .value(function(d) { return d.count })
  .sort(null)

  let tooltip = d3.select('.pisten')
  .append('div')
  .attr('class', 'tooltip')

  tooltip.append('div')
  .attr('class', 'label')

  tooltip.append('div')
  .attr('class', 'count')

  tooltip.append('div')
  .attr('class', 'percent')

  let path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) {
    return color(d.data.label)
  })
  .each(function(d) { this._current = d })

  path.on('mouseover', function(d) {
    let total = d3.sum(dataset.map(function(d) {
      return (d.enabled) ? d.count : 0
    }));
    let percent = Math.round(1000 * d.data.count / total) / 10
    tooltip.select('.label').html(d.data.label)
    tooltip.select('.count').html("Anzahl: "+d.data.count)
    tooltip.style('display', 'block')
  });

  path.on('mouseout', function() {
    tooltip.style('display', 'none')
  });

  let legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    let height = legendRectSize + legendSpacing
    let offset =  height * color.domain().length / 2
    let horz = -2 * legendRectSize
    let vert = i * height - offset
    return 'translate(' + horz + ',' + vert + ')'
  });

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color)
  .on('click', function(label) {
    let rect = d3.select(this)
    let enabled = true
    let totalEnabled = d3.sum(dataset.map(function(d) {
      return (d.enabled) ? 1 : 0
    }));

    if (rect.attr('class') === 'disabled') {
      rect.attr('class', '')
    } else {
      if (totalEnabled < 2) return
      rect.attr('class', 'disabled')
      enabled = false
    }

    pie.value(function(d) {
      if (d.label === label) d.enabled = enabled
      return (d.enabled) ? d.count : 0
    });

    path = path.data(pie(dataset))

    path.transition()
    .duration(750)
    .attrTween('d', function(d) {
      let interpolate = d3.interpolate(this._current, d)
      this._current = interpolate(0)
      return function(t) {
        return arc(interpolate(t))
      };
    });
  });

  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d })
}

export function snowDepth() {
  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 30, left: 20},
  width = document.getElementsByClassName("schnee")[0].parentElement.offsetWidth - margin.right - margin.left,
  height = 200

  // parse the date / time
  let parseTime = d3.timeParse("%d-%b-%y")

  // set the ranges
  let x = d3.scaleTime().range([0, width])
  let y = d3.scaleLinear().range([height, 0])

  // define the area
  let area = d3.area()
  .x(function(d) { return x(d.date) })
  .y0(height)
  .y1(function(d) { return y(d.close) })

  // define the line
  let valueline = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.close); })

  let svg = d3.select(".schnee").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // get the data
  d3.csv("/assets/data/snow.csv", function(error, data) {
    if (error) throw error

    // format the data
    data.forEach(function(d) {
      d.date = parseTime(d.date)
      d.close = +d.close
    });

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }))
    y.domain([0, d3.max(data, function(d) { return d.close; })])

    // add the area
    svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area)

    // add the valueline path.
    svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)

    // add the X Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

    // add the Y Axis
    svg.append("g")
    .call(d3.axisLeft(y))

  });

}
