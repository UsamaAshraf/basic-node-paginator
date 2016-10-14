exports.getTotalCount = function getTotalCount(_db_connection, _table_name, custom_query, done) 
{
	var query = custom_query ? "SELECT COUNT(*) as cn FROM (" + custom_query + ") _t_" : 
				"SELECT COUNT(*) as cn FROM " + _table_name;

	_db_connection.get().query(query, 
		function (err, cnt) {
        if (err) { return done(err, null); }
        else {
            return done(null, cnt[0].cn);
        }
    })
}


exports.getRecords = function getRecords(_pageNum, _db_connection, _table_name, _records_per_page, custom_query, callback) 
{
	var query = custom_query ? custom_query + " LIMIT ?, ?" : "SELECT * FROM " + _table_name + " LIMIT ?, ?";

    _db_connection.get().query(query, [_records_per_page * (_pageNum-1), _records_per_page], 
		function (err, rows) {
        if (err) {
            return callback(err, null);
        }
        else {
            return callback(null, rows);
        }
    })
}