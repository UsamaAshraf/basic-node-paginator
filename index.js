var validator = require('./helpers/validators');
var links = require('./helpers/links');
var runner = require('./helpers/runner');


function Paginator(obj) {
    
	if(! validator.isAlphaOrParen(obj.pageParam))
		throw new Error("Invalid page parameter.");
	
	if(! obj.hasOwnProperty('dbConn'))
		throw new Error("Database connection not provided.");

	this.db_connection = obj.dbConn;
	this.table_name = obj.hasOwnProperty('tableName') 	     ? obj.tableName : null;
	this.records_per_page = obj.hasOwnProperty('pageSize')   ? obj.pageSize :  25;
	this.base_url = obj.hasOwnProperty('baseUrl')     	     ? obj.baseUrl :   null;
	this.paging_param_name = obj.hasOwnProperty('pageParam') ? obj.pageParam : null;

	this.link_ul_classes = obj.hasOwnProperty('linksClasses') ? obj.linksClasses : 'pagination';
	this.link_inactive_li_classes = obj.hasOwnProperty('inactiveClasses') ? obj.inactiveClasses : '';
	this.link_active_li_classes = obj.hasOwnProperty('activeClasses') ? obj.activeClasses : 'active';

	this.custom_query = obj.customQuery ? obj.customQuery : null;
}


Paginator.prototype.configureInstance = function configureInstance(obj) {    
    
	if(obj.hasOwnProperty('pageSize') && ! validator.isPositiveInt(obj.pageSize))
		throw new Error("Invalid page size.");
	
	this.base_url = obj.hasOwnProperty('baseUrl')     	     ? obj.baseUrl :   this.base_url;
    this.table_name = obj.hasOwnProperty('tableName') 	     ? obj.tableName : this.table_name;
	this.records_per_page = obj.hasOwnProperty('pageSize')   ? obj.pageSize :  this.records_per_page;
	this.db_connection = obj.hasOwnProperty('dbConn') 	     ? obj.dbConn :    this.db_connection;
	this.paging_param_name = obj.hasOwnProperty('pageParam') ? obj.pageParam : this.paging_param_name;

	this.link_ul_classes = obj.hasOwnProperty('linksClasses') ? obj.linksClasses : 'pagination';
	this.link_inactive_li_classes = obj.hasOwnProperty('inactiveClasses') ? obj.inactiveClasses : '';
	this.link_active_li_classes = obj.hasOwnProperty('activeClasses') ? obj.activeClasses : 'active';

	this.custom_query = obj.customQuery ? obj.customQuery : null;
};


Paginator.prototype.getPage = function getPage(_pageNum, success, error) {

	if(! this.db_connection || (! this.table_name && ! this.custom_query) || 
	   ! this.records_per_page || ! _pageNum || ! this.base_url || ! validator.isPositiveInt(_pageNum)) 
	{
		return error("Invalid configuration or parameters found.");
    }
	
	var self = this;
	
	runner.getRecords(_pageNum, this.db_connection, this.table_name, this.records_per_page, this.custom_query, 
		function(err, result) {

		if(err || result.length == 0) {
			return error(err);
		}
		
		runner.getTotalCount(self.db_connection, self.table_name, self.custom_query, 
			function(_err, recordCount) {

			if(_err || recordCount == 0) {
				return error(err);
			}

			links_html = 
			links.getLinks(_pageNum, Math.ceil(recordCount / self.records_per_page), recordCount, 
			self.base_url, self.paging_param_name, self.link_ul_classes, self.link_active_li_classes, self.link_inactive_li_classes);
			
			return success({records: result, links: links_html});
		});
	});
}


exports.createPaginator = function createPaginator(obj) {

	return new Paginator(obj);
}
