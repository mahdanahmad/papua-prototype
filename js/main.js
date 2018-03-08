$( document ).ready(function() {
	createMap();

	d3.csv('public/csv/papua.csv', (err, res) => {
		if (err) { throw err; }

		data		= res;
		mappedData	= _.keyBy(res, 'id');
		data.forEach((o) => { o.case = +o.case; o.victim = +o.victim; });

		setTimeout(function () {
			createBar();
			redrawMap();
		}, 100);
	});
});
