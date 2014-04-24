angular.module('Filters', [])
/*
|--------------------------------------------------------
| FILTERS
|--------------------------------------------------------
*/
.filter('dollar_currency', [ '$filter', '$locale', function(filter, locale){
    /*----------------------------------------------
    | requires currency (AngularJS default filter)
    |
    | input : number
    | output : US dollars format : $12,287,100
    ----------------------------------------------*/
    var currencyFilter = filter('currency');
    var formats = locale.NUMBER_FORMATS;
    return function(amount, currencySymbol){
        var value = currencyFilter(amount, currencySymbol);
        var sep = value.indexOf(formats.DECIMAL_SEP);
        if(amount >= 0) {
            return value.substring(0, sep);
        }
        return value.substring(0, sep) + ')';
    };
}])
.filter('dateDisplay', function(){
    /*----------------------------------------------
    | requires currency (AngularJS default filter)
    |
    | input : 2014-12-31 10:14
    | output : December 31, 2014 | 10:14
    ----------------------------------------------*/
    return function(str, type){
        if(str == undefined){return str}
        var Date = str.split(' '),
            date = Date[0].split('-'),
            hour = Date[1].split(':'),
            date_y = date[0],
            date_m = date[1],
            date_d = date[2],
            hour_h = hour[0],
            hour_m = hour[1],
            hour_s = hour[2],
            s = ' ';
        if(type == 'date'){
            
        }
        else if(type == 'hour'){
            
        }
        else{
            return data_config.str_month[parseInt(date_m)] + s + date_d + ', ' + date_y + ' | ' + Date[1]
        }
    }
});