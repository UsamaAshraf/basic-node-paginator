function getUrl(base, param) 
{	
	if(param == '/') {
		
		return base.slice(-1) == '/' ? base : base + '/';
	}
	else {
		return base.slice(-1) == '/' ? base + '?' + param + '=' : base + '/?' + param + '=';
	}
}


exports.getLinks = function (_pageNum, numOfPages, recordCount, baseUrl, pagingParam, linksClasses, activeClasses, inactiveClasses) 
{	
	var links = "<ul class='" + linksClasses + "'>";
	var url = getUrl(baseUrl, pagingParam);
	
	for(var i = 1; i <= numOfPages; ++i) {

		if(i == _pageNum) {
			links += "<li class='"+activeClasses+"'><span>" + i + "</span></li>";
		}
		else {
			links += "<li class='"+inactiveClasses+"'><a href='"+ url + i +"'>" + i + "</a></li>";
		}
	}

	links += "</ul>";
	return links;
}
