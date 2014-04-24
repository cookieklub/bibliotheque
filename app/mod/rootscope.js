angular.module('Rootscope', [])
/*
|--------------------------------------------------------
| ROOTSCOPE
|--------------------------------------------------------
*/
.run(function($rootScope, $http, $location){
    //-----------------
    // GLOBAL FUNCTIONS
    //-----------------
    $rootScope.parseInt = parseInt;
    $rootScope.toString = toString;
    $rootScope.typeof = function(element){return typeof(element);};
    $rootScope.substring = function(full_str, sub_str){
        if(full_str == undefined){
            return ''
        }
        return full_str.substring(full_str.lastIndexOf(sub_str))
    };
    /*$rootScope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };*/
    $rootScope.empty_data = function (data, new_data){if(data == '' || data == undefined){return new_data}else{return data}};
    $rootScope.empty_obj = function (obj){return $.isEmptyObject(obj)};
    $rootScope.scroll_top = function(delay, position, callback){
        if(typeof(callback) === 'function'){
            $("body").delay($rootScope.empty_data(delay, 0)).animate({scrollTop:$rootScope.empty_data(position, 0)}, '200', 'swing', function(){
                callback();
            });
        }
        else{
            $("body").delay($rootScope.empty_data(delay, 0)).animate({scrollTop:$rootScope.empty_data(position, 0)}, '200', 'swing');
        }
    };
    $rootScope.screen_on = function(delay){
        if($.cookie('session') != 'connected'){
            window.location.href = '#/login';
        }
		if($(".screen").css("display") == "none"){
        	$(".screen").delay($rootScope.empty_data(delay, 0)).fadeIn(300);
        }
    };
    $rootScope.dom_callback = function(fctn){
        if(jQuery.ready){
            fctn();
        }
        else{
            $(document).ready(function(){
                fctn();
            });
        }
    };
    $rootScope.wait_for = function(test, callback, count){
        count = defined_default(count, 0);
        if(test){
            callback();
        }
        else if(count < 10){
            window.setTimeout(function() {
                $rootScope.wait_for(test, callback, count+1);
            }, 200);
        }
        else{
            callback();
        }
    };
    $rootScope.return_number = function(str_var) {
        str_var = str_var.toString();
        var newstr_var = '';
        for(i=0;i<str_var.length;i++) {
            newstr_var += (isNaN(str_var.substr(i, 1)) || str_var[i] == ' ') ? '' : str_var.substr(i, 1);
        }
        return newstr_var
    };
    $rootScope.clean_img_url = function(url){
        var clean_url = $rootScope.substring(url, 'img/');
        //dev.log(clean_url);
        return (config.base_url + clean_url).replace(/ /g, '%20');
    };
    $rootScope.upload_url = function(url, substitute){
        return (config.upload_url + $rootScope.empty_data(url, substitute)).replace(/ /g, '%20')
    };
    //-----------
    // NAVIGATION
    //-----------
    $rootScope.navigate = function(url, force_reload){
        if(url != $location.path() && url != 'reload' && !$rootScope.empty_data(force_reload, false)){
            $(".screen").fadeOut(300, function(){
                $location.path(url);
                //window.location.href = ('/public/www/index.html#' + url);
                $rootScope.$apply();
                //$rootScope.screen_on();
                //$rootScope.scroll_top();
            });
        }
        else if(url == 'reload' || $rootScope.empty_data(force_reload, false)){
            $rootScope.rootscope_init();
        }
        else{
            dev.log('do nothing');
        }
    };
    //-----------
    // INFO MODAL
    //-----------
    $rootScope.info_modal = function(info, fctn){
        $('#info-modal .modal-block .content .info').text(array2str(info));
        $('#info-modal .modal-mask').fadeIn(200, function(){
            $('#info-modal .modal-block').effect('slide', {direction:'up'}, function(){
                $('#info-modal #info-modal-ok').focus();
            });
        });
        // RESET BINDINGS
        if(fctn != undefined){
            $('#info-modal .modal-mask').unbind('click').bind('click', function(){
                $rootScope.dismiss('#info-modal', fctn);
            });
            $('#info-modal #info-modal-ok').unbind('click').bind('click', function(){
                $rootScope.dismiss('#info-modal', fctn);
            });
        }
        else{
            $('#info-modal .modal-mask').unbind('click').bind('click', function(){
                $rootScope.dismiss('#info-modal');
            });
            $('#info-modal #info-modal-ok').unbind('click').bind('click', function(){
                $rootScope.dismiss('#info-modal');
            });
        }
    };
    //-----------
    // CONFIRM MODAL
    //-----------
    $rootScope.confirm_modal = function(info, fctn, button_value){
        button_value = defined_default(button_value, 'OK');

        $('#confirm-modal .modal-block .content .info').text(array2str(info));
        $('#confirm-modal #confirm-modal-confirm').text(button_value);

        $('#confirm-modal .modal-mask').fadeIn(200, function(){
            $('#confirm-modal .modal-block').effect('slide', {direction:'up'}, function(){
                $('#confirm-modal #confirm-modal-confirm').focus();
            });
        });
        // RESET BINDINGS
        $('#confirm-modal .modal-mask').unbind('click').bind('click', function(){
            $rootScope.dismiss('#confirm-modal');
        });
        $('#confirm-modal #confirm-modal-ok').unbind('click').bind('click', function(){
            $rootScope.dismiss('#confirm-modal');
        });

        if(typeof(fctn) === 'function'){
            $('#confirm-modal #confirm-modal-confirm').unbind('click').bind('click', function(){
                $rootScope.dismiss('#confirm-modal', fctn);
            });
        }
        else{
            $('#confirm-modal #confirm-modal-confirm').unbind('click').bind('click', function(){
                $rootScope.dismiss('#confirm-modal');
            });
        }
    };
    //------------
    // ERROR MODAL
    //------------
    $rootScope.alert_error = function(info, fctn){
        info = (info != undefined) ? info : 'An unknown error occured.';
        
        $('#error-modal .modal-block .content .info-error').text(array2str(info));
        $('#error-modal .modal-mask').fadeIn(200, function(){
            $('#error-modal .modal-block').effect('slide', {direction:'up'}, function(){
                $('#error-modal #error-modal-ok').focus();
            });
        });
        // RESET BINDINGS
        $('#error-modal .modal-mask').unbind('click').bind('click', function(){
            $rootScope.dismiss('#error-modal', fctn);
        });
        $('#error-modal #error-modal-ok').unbind('click').bind('click', function(){
            $rootScope.dismiss('#error-modal', fctn);
        });
        
    };
    //-------------
    // CUSTOM MODAL
    //-------------
    $rootScope.display_modal = function(id){
        $(id + ' .modal-mask').fadeIn(200, function(){
            $(id + ' .modal-block').effect('slide', {direction:'up'});
        });
    };
    $rootScope.dismiss = function(id, fctn){
        $(id + ' .modal-block').effect('drop', {direction:'up'}, function(){
            $(id + ' .modal-mask').fadeOut(200, function(){
                if(fctn != undefined){fctn()};
            });
        });
    };
    $rootScope.hide_modal = function(id){
        $(id).fadeOut(400);
    };
    //-----
    // INIT
    //-----
    $rootScope.init = function(){
        $rootScope.session = false;
        $rootScope.dom_callback(function(){
            $('body').delay(0).fadeIn(1, function(){
                $rootScope.screen_on();
            });
        });
    };
    $rootScope.init();
});