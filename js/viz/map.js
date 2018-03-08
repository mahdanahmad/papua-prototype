let mappedGeo	= {};
let path;

const legend		= ['High', 'Mid', 'Low', 'No data'];
const legend_wdt	= 75;
const legend_bot	= 50;
const legend_rect	= 10;

const option_left	= 75;
const option_wdt	= 50;

function createMap() {
	d3.select(map_dest).selectAll("svg").remove();

	let canvasWidth		= $(map_dest).outerWidth(true);
	let canvasHeight	= $(map_dest).outerHeight(true);

	let margin 			= { top: 0, right: 0, bottom: 0, left: 0 };
	let width			= canvasWidth - margin.right - margin.left;
	let height			= canvasHeight - margin.top - margin.bottom;

	let projection		= d3.geoMercator()
		.scale(width * 4.25)
		.center([135.25, -4.25])
		.translate([width / 2, height / 2]);

	path	= d3.geoPath().projection(projection);

	let svg = d3.select(map_dest).append("svg")
		.attr("id", map_id)
    	.attr("width", canvasWidth)
        .attr("height", canvasHeight)
		.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('rect')
		.attr('id', 'background')
		.attr('width', width)
		.attr('height', height)
		// .on('click', () => { zoomProv(null) });

	d3.json('public/json/papua.geojson', (err, kabs) => {
		if (err) return console.error(err);

		svg.selectAll('path.kabupaten').data(kabs.features).enter().append('path')
			.attr("id", (o) => ('kab-' + (o.properties.id_kabkota)))
			.attr('d', path)
			.attr('class', (o) => ('kabupaten color-4'))
			.attr('vector-effect', 'non-scaling-stroke')
			.on('click', onClick)
			.on('mouseover', onMouseover)
			.on('mouseout', onMouseout)
			.on('mousemove', (o) => { hoverHandler(o.properties.id_kabkota) });
	});

	function onClick(o) {  }
	function onMouseover(o) { d3.select(map_tips).classed('hidden', false); }
	function onMouseout(o) { d3.select(map_tips).classed('hidden', true); }
	function hoverHandler(id) {
		let currentPos	= d3.mouse(d3.select("svg#" + map_id + ' > g').node());
		let tooltips	= $( map_tips );

		tooltips.html(mappedData[id].name + '<br /> ' + mappedData[id].case + ' case' + (mappedData[id].case > 1 ? 's' : '') + ' - ' + mappedData[id].victim + ' victim' + (mappedData[id].victim > 1 ? 's' : ''));
		tooltips.css({ top: currentPos[1] - tooltips.outerHeight(true) - 13, left: currentPos[0] - (tooltips.outerWidth(true) / 2) });
	}

	let legendGroup	= svg.append('g')
		.attr('id', 'legend-wrapper')
		.attr('transform', 'translate(' + (margin.left + legend_bot) + ',' + (height - legend_bot) + ')')
		.selectAll('.legend-group')
		.data(legend).enter().append('g')
			.attr('class', 'legend-group')
			.attr('transform', (o, i) => ('translate(' + (i * legend_wdt) + ',0)'));

	legendGroup.append('rect')
		.attr('class', (o, i) => ('color-' + (i + 1)))
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', legend_rect)
		.attr('width', legend_rect);

	legendGroup.append('text')
		.attr('transform', 'translate(' + (legend_rect + 5) + ',0)')
		.attr('alignment-baseline', 'hanging')
		.text((o) => (o));

	let viewWrapper	= svg.append('g')
		.attr('id', 'view-wrapper')
		.attr('transform', 'translate(' + (width - 210) + ',' + (margin.top + 50) + ')');

	viewWrapper.append('text')
		.text('View by :');

	viewWrapper.append('rect')
		.attr('id', 'option-select')
		.attr('x', option_left - (option_wdt / 2))
		.attr('y', -13.5)
		.attr('height', 20)
		.attr('width', option_wdt);

	viewWrapper.append('g')
		.attr('id', 'options-wrapper')
		.attr('transform', 'translate(' + option_left + ',0)')
		.selectAll('.view-option')
		.data(sort_val).enter().append('text')
			.attr('class', 'view-option cursor-pointer')
			.attr('text-anchor', 'middle')
			.attr('transform', (o, i) => ('translate(' + (i * option_wdt) + ',0)'))
			.text((o) => (_.capitalize(o)))
			.on('click', (o, i) => {
				if (o !== sort_by) {
					sort_by	= o;
					createBar();
					redrawMap();

					let transition	= d3.transition()
				        .duration(250)
				        .ease(d3.easeLinear);

					viewWrapper.select('rect#option-select').transition(transition)
						.attr('x', option_left + (i * option_wdt) - (option_wdt / 2));
				}
			});
}

function redrawMap() {
	$(' .kabupaten ').removeClass((idx, className) => ((className.match (/(^|\s)color-\S+/g) || []).join(' ')) );

	let min	= d3.min(data, (o) => (o[sort_by]));
	let max	= d3.max(data, (o) => (o[sort_by]));

	let range		= _.ceil((max - min) / 3);
	let fracture	= _.times(3, (i) => (_.ceil(max) - ((i + 1) * range)));

	_.forEach(data, (o) => { $('.kabupaten#kab-' + o.id).addClass(checkProvRange(o[sort_by])); });

	function checkProvRange(value) {
		let className	= "";
		_.forEach(fracture, (o, i) => {
			if (value >= o && _.isEmpty(className)) { className = 'color-' + (i + 1); }
		});

		return !_.isEmpty(className) && value ? className : 'color-4';
	}
}
