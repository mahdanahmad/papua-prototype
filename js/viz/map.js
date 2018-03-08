let mappedGeo	= {};
let path;

function createMap() {
	d3.select(map_dest).selectAll("svg").remove();

	let canvasWidth		= $(map_dest).outerWidth(true);
	let canvasHeight	= $(map_dest).outerHeight(true);

	let margin 			= { top: 0, right: 0, bottom: 0, left: 0 };
	let width			= canvasWidth - margin.right - margin.left;
	let height			= canvasHeight - margin.top - margin.bottom;

	let projection		= d3.geoEquirectangular()
		.scale(width * 4)
		.rotate([-(width / 10), 0])
		.translate([-(width / 7.5), height / 10]);


	// console.log(d3.geoEquirectangular().scale());
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

	d3.queue()
		.defer(d3.csv, 'public/csv/papua.csv')
		.defer(d3.json, 'public/json/papua.geojson')
		.await((err, data, kabs) => {
			if (err) return console.error(err);

			console.log(data);

			svg.selectAll('path.kabupaten')
				.data(kabs.features)
					.enter().append('path')
					.attr("id", (o) => ('kab-' + (o.properties.id_kabkota)))
					.attr('d', path)
					.attr('class', (o) => ('kabupaten'))
					.attr('vector-effect', 'non-scaling-stroke')
					.on('click', onClick)
					.on('mouseover', onMouseover)
					.on('mouseout', onMouseout)
					.on('mousemove', (o) => { hoverHandler(o.properties.id_kabkota, o.properties.nm_kabkota) });


		});
}

function onClick(o) {  }
function onMouseover(o) { }
function onMouseout(o) { }
function hoverHandler(id, name) {

}
