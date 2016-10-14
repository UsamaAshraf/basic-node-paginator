This is an easily integratable paginator for the popular [mysql](https://www.npmjs.com/package/mysql) node module.

The generated links are by default compatible with the [Bootstrap CSS framework](http://getbootstrap.com/).

The CSS classes applied to the links can be overridden.

Custom queries with joins, special clauses, aggregates etc can also be provided.


If your MySQL version or configuration causes problems with SQL_CALC_FOUND_ROWS / FOUND_ROWS(),
then please install version 1.2.5.

Otherwise, you can install version 1.2.2 and expect better performance.

## Table of Contents

- [Install](#install)
- [Setup](#setup)
- [State](#state)
- [Example](#example)


## Install

```sh
$ npm install basic-node-paginator
```

## Setup

Here is an example of a mysql configuration you may be using.
Make sure to export the get() method that returns the connection pool:
```js
// db.js

var mysql = require('mysql');
var PRODUCTION_DB = 'productiondb';
var TEST_DB = 'testdb'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
    pool: null,
    mode: null,
}

exports.connect = function (mode, done)
{
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '@#$1!%%',
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
    })
    
    state.mode = mode
    done()
}

exports.get = function ()
{
    return state.pool
}
```

This is the paging module that will export a paginator object. The createPaginator() factory method
initializes the state of the paginator object it returns. 

```js
// paging.js

var db = require('./db');
var paginator = require('basic-node-paginator');

var MyPaginator = paginator.createPaginator({
    dbConn: db,
    pageParam: '/'
});

exports.MyPaginator = MyPaginator;
```


The paginator object exposes a few methods:

*  `configureInstance(obj)` :   Meant to change the state of the paginator. 

*  `getPage(page_num, success, error)`


## State

The state of the paginator includes:

* `pageSize`: The number of records to be displayed per page. The default is 25.

* `tableName`: The table from where to retrieve the records.

* `customQuery`: A user-defined MySQL query that will be used instead of `table_name` if provided. Example:

`SELECT users.name, posts.text FROM users INNER JOIN posts on users.id = posts.user_id`
    
Note:  You can use [Squel.js](https://hiddentao.github.io/squel/) to generate queries.

* `linksClasses`: The space-separated classes applied to the ul element of the links. The default is 'pagination'.

* `inactiveClasses`: The space-separated classes applied to the inactive pages' li elements within the list.

* `activeClasses`: The space-separated classes applied to the current page's li element within the list. The default is 'active'.

* `dbConn`:  The config module which exports a get() method returning the mysql pool object.

* `baseUrl`: This is the base url that all the generated links will point to.

* `pageParam`: The name of the paramater that will be appended to the base url in the links.
This will contain the page number to be requested.
It can be set to '/' for cleaner page urls like:

```txt
/admin/users/1
```

as opposed to something like:

```txt
/admin/users/?page=1
```


## Example

This is what the route may look like:

```txt
/admin/users/:page?
```

Here is a method that may serve the request to this route.

```js
var paginator = require('./paging');

var page_num = req.params.page ? req.params.page : 1;

paginator.MyPaginator.configureInstance({
    pageSize: 5,
    tableName : 'users',
    baseUrl: '/admin/users'
});

paginator.MyPaginator.getPage(page_num, 
function (obj) {
    
    return res.render('users', {users: obj.records, links: obj.links});

}, function (err) {
    
    return res.render('error');
});
```

And in your users.jade file:

```jade
row.text-center !{links}

each user in users
    <!-- Display users in a table or something. -->
```

Note:   This can be easily done with some other templating engine as well. Jade is used only for demonstration. 
