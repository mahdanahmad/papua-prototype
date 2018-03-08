const map_dest	= '#map-wrapper';
const map_id	= 'map-viz';
const map_tips	= '#map-tooltips';

const bar_dest	= '#bar-wrapper';
const bar_id	= 'bar-viz';
const bar_tips	= '#bar-tooltips';

const sort_val	= ['case', 'victim'];
let sort_by		= _.head(sort_val);

let data, mappedData;
