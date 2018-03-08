function createBar() {
	d3.select(bar_dest).selectAll('svg').remove();

	let canvasWidth		= $(bar_dest).outerWidth(true);
	let canvasHeight	= $(bar_dest).outerHeight(true);

	let margin 			= { top: 25, right: 25, bottom: 25, left: 125 };
	let width			= canvasWidth - margin.right - margin.left;
	let height			= canvasHeight - margin.top - margin.bottom;

	let x 				= d3.scaleLinear().range([0, width]);
	let y 				= d3.scaleBand().range([height, 0]);

	let svg = d3.select(bar_dest).append('svg')
		.attr("id", bar_id)
    	.attr("width", canvasWidth)
        .attr("height", canvasHeight)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	x.domain([0, d3.max(data, (o) => (o[sort_by]))]);
	y.domain(_.chain(data).orderBy(sort_by).map((o) => (o.name)).value());

	let groupBar	= svg.selectAll('.group-bar')
		.data(data).enter().append('g')
			.attr('class', 'group-bar')
			.attr('transform', (o) => ('translate(0,' + y(o.name) + ')'))

	groupBar.append('rect')
		.attr('class', 'bar')
		.attr('width', 0)
		.attr('height', y.bandwidth() * .9);

	groupBar.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', y.bandwidth());

	groupBar
		.on('click', onClick)
		.on('mouseover', onMouseover)
		.on('mouseout', onMouseout);

	function onClick(o) { }
	function onMouseover(o) {
		d3.select(this).classed('active', true);
		d3.select(bar_tips).classed('hidden', false);

		let xPos	= (x(o[sort_by]) || 0) + margin.left - 13;
		let yPos	= y(o.name) - 4;

		d3.select(bar_tips)
			.style('left', xPos + 'px')
			.style('top', yPos + 'px')
			.text(o[sort_by]);
	}
	function onMouseout(o) {
		d3.select(this).classed('active', false);
		d3.select(bar_tips).classed('hidden', true);
	}

	svg.append('g')
		.attr('id', 'y-axis')
		.attr('class', 'axis')
		.call(d3.axisLeft(y).tickSize(0));

	let transition	= d3.transition()
        .duration(500)
        .ease(d3.easeLinear);

	svg.selectAll('.bar').transition(transition)
		.attr('width', (o) => (x(o[sort_by]) || 0));

}
