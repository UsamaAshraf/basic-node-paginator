exports.isAlphaOrParen = function (str) {
    
    return /[a-z]/i.test(str) || str == '/';
}


exports.isPositiveInt = function(_num) {

	return (parseInt(_num, 10) > 0);
}
