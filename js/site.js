var activity_chart = dc.pieChart("#activity");

var country_chart = dc.pieChart("#country");
var region_chart = dc.geoChoroplethChart("#map");
var who_by_chart = dc.rowChart("#who-by");
var who_to_chart = dc.rowChart("#who-to");
var what_activity_chart = dc.rowChart("#what-activity");
var what_items_chart = dc.rowChart("#what-items");
var what_services_chart = dc.rowChart("#what-services");
var where_province_chart = dc.rowChart("#where-province");
var where_region_chart = dc.pieChart	("#where-region");
var cf = crossfilter(data);

cf.activity = cf.dimension(function (d) {
		return d.Implementing_Partner_Supported_by;
	});
cf.country = cf.dimension(function (d) {
		return d.REGION;
	});
cf.what_services = cf.dimension(function (d) {
		return d.Materials_Service_Provided;
	});
cf.region = cf.dimension(function (d) {
		return d.Province;
	});

cf.who_by = cf.dimension(function (d) {
		return d.Implementing_Partner_Supported_by;
	});

cf.who_to = cf.dimension(function (d) {
		return d.Primary_Beneficiary;
	});
cf.what_activity = cf.dimension(function (d) {
		return d.Activity;
	});
cf.what_items = cf.dimension(function (d) {
		return d.Materials_Service_Provided;
	});
cf.where_province = cf.dimension(function (d) {
		return d.Province;
	});
cf.where_region = cf.dimension(function (d) {
		return d.REGION;
	});

var activity = cf.activity.group();
var country = cf.country.group();
var what_services = cf.what_services.group();
var region = cf.region.group();
var who_by = cf.who_by.group();
var who_to = cf.who_to.group();
var what_activity = cf.what_activity.group();
var what_items = cf.what_items.group();
var where_region = cf.where_region.group();
var where_province = cf.where_province.group();
var all = cf.groupAll();

who_by_chart.width(	260).height(220)
.dimension(cf.who_by)
.group(who_by)

.ordering(function (d) {
	return -d.who_by
})
.elasticX(true)
.colors([

		/* 		'#D7E3EF',
		'#7091B2', */
		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

who_to_chart.width(260).height(220)
.dimension(cf.who_to)
.group(who_to)
.colors([

		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

what_activity_chart.width(260).height(220)
.dimension(cf.what_activity)
.group(what_activity)
.colors([

		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

what_items_chart.width(260).height(220)
.dimension(cf.what_items)
.group(what_items)
.colors([

		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

where_region_chart.width(220).height(220)
.dimension(cf.where_region)
.group(where_region)
    .slicesCap(15)
    .innerRadius(40)
/* .renderLabel(false)
.legend(dc.legend())
 */.colors([
		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;

	
});

where_province_chart.width(260).height(220)
.dimension(cf.where_province)
.group(where_province)
.ordering(function (d) {
	return -d.where_province
})
.colors([
/* 
		'#D7E3EF',
		'#7091B2',
		'#1F4060' */
		'#7FC9FF'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

activity_chart.width(260).height(220)
.dimension(cf.activity)
.group(activity)
.colors([

		'#D7E3EF',
		'#7091B2',
		'#1F4060'
	])
.colorDomain([1, 8])
.colorAccessor(function (d, i) {
	return i % 7 + 1;
});

country_chart.width(260).height(220)
.dimension(cf.country)
.group(country)
.colors([
		'#EFD7D7',
		'#B27070',
		'#601F1F'
	])
.colorDomain([0, 3])
.colorAccessor(function (d, i) {
	return i % 4;
});

what_services_chart.width(600).height(500)
.dimension(cf.what_services)
.group(what_services)
.ordering(function (d) {
	return -d.what_services
})
.elasticX(true)
.data(function (group) {
	return group.top(50);
})
.colors([
		/* 		'#D7DDEF',
		'#70B277',
		'#60211F',
		'#0E2103'*/
		'#FF7F7F'
	])
.colorDomain([0, 8])
.colorAccessor(function (d, i) {
	return i % 8;
});

region_chart.width(600).height(480)
.dimension(cf.region)
.group(region)
.colors(['#EAEAEA', '#FF7F7F'])
.colorDomain([0, 1])
.colorAccessor(function (d) {
	if (d > 0) {
		return 1;
	} else {
		return 0;
	}
})
.overlayGeoJson(regions.features, "Regions", function (d) {
	return d.properties.NAME_REF;
})
.projection(d3.geo.mercator().center([125.5, 14.1]).scale(4500))
.title(function (d) {
	return d.key;
});

dc.renderAll();

var projection = d3.geo.mercator()
	.center([125.5, 14.1])
	.scale(4500);

var path = d3.geo.path()
	.projection(projection);

var g = d3.selectAll("#map").select("svg").append("g");

g.selectAll("path")
.data(provinces.features)
.enter()
.append("path")
.attr("d", path)
.attr("stroke", '#000000')
.attr("stroke-width", '1px')
.attr("fill", 'none')
.attr("opacity", 0.5)
.attr("class", "country");

var mapLabels = d3.selectAll("#map").select("svg").append("g");

mapLabels.selectAll('text')
.data(provinces.features)
.enter()
.append("text")
.attr("x", function (d, i) {
	return path.centroid(d)[0];
})
.attr("y", function (d, i) {
	return path.centroid(d)[1];
})
.attr("dy", ".55em")
.attr("class", "maplabel")
.style("font-size", "12px")
.attr("opacity", 0.5)
.text(function (d, i) {
	return d.properties.region;
});

dc.dataCount("#count-info")
.dimension(cf)
.group(all);
