angular.module('Directives', [])
/*
|--------------------------------------------------------
| DIRECTIVES
|--------------------------------------------------------
*/
.directive('navHref', function($rootScope){
    /*----------------------------------------------
    | TO USE ON ANY TAG
    |
    | navigation on other than a tags
    |
    | attribute: nav-href="/home"
    ----------------------------------------------*/
    return {
        restrict:'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $rootScope.navigate(attr.navHref, $rootScope.empty_data(attr.reload != undefined, false));
            });
        }
    }
})
.directive('ngClickJs', function ($location, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                eval(element.attr('ng-click-js'));
            });
        }
    }
})
.directive('nav', function ($rootScope, $location) {
    /*----------------------------------------------
    | TO USE ON A TAG
    |
    | navigation on site with animation effects
    |
    | <a href="/home" nav>
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                close_menu();
                $rootScope.navigate(element.attr('href'), $rootScope.empty_data(attr.reload != undefined, false));
            });
        }
    }
})
.directive('navSession', function ($location, $rootScope) {
    /*----------------------------------------------
    | TO USE ON A TAG
    |
    | link only active if user connected. Or login menu opening
    |
    | attribute nav-session="You need to log in first"
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                close_menu();
                e.stopPropagation();
                e.preventDefault();
                if($rootScope.connected){
                    $rootScope.navigate(element.attr('href'), $rootScope.empty_data(attr.reload != undefined, false));
                }
                else{
                    $rootScope.open_login(element.attr('nav-session'));
                }
                
            });
        }
    }
})
.directive('noScroll', function () {
    /*----------------------------------------------
    | TO USE ON TAGS THAT ALLOW SCROLL
    |
    | avoids to scroll the entire page when the scroll
    | hits the end of the tag
    |
    | attribute no-scroll
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $(element).bind('mousewheel DOMMouseScroll', function(e) {
                var scrollTo = null;
                if (e.type == 'mousewheel') {
                    scrollTo = (e.originalEvent.wheelDelta * -1);
                }
                else if (e.type == 'DOMMouseScroll') {
                    scrollTo = 40 * e.originalEvent.detail;
                }
                if (scrollTo) {
                    e.preventDefault();
                    $(this).scrollTop(scrollTo + $(this).scrollTop());
                }
            });
        }
    }
})
.directive('placeholderFocus', function () {
    /*----------------------------------------------
    | TO USE ON INPUT TAGS
    |
    | works like placeholder but placeholder disapear when
    | user focuses the input, not when he starts typing
    |
    | attribute placeholder-focus="Enter Password"
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $(element).attr('placeholder', $(element).attr('placeholder-focus'));
            $(element).bind('focus', function(e) {
                $(this).attr('placeholder', '');
            });
            $(element).bind('blur', function(e) {
                $(this).attr('placeholder', $(this).attr('placeholder-focus'));
            });
        }
    }
})
.directive('print', function () {
    /*----------------------------------------------
    | TO USE ON ANY TAG THAT TRIGGERS THE PRINT OF AN OTHER TAG
    |
    | print the content of a tag by entering its css selector
    | as an attribute.
    | optional: add title after the css selector and ::
    |
    | attribute print="#reports"
    | attribute print="#reports::Print Reports"
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr){
            element.bind('click', function(e){
                var title = null,
                    data = null,
                    mywindow = null;
                // check if title is set
                if(element.attr('print').indexOf('::') > -1){
                    title = element.attr('print').split('::');
                    title.splice(0,1);
                    title.join('::');
                    data = $(element.attr('print').split('::')[0]).clone().html();
                }
                else{
                    title = 'Print';
                    data = $(element.attr('print')).clone().html();
                }
                console.log(data);
                // print
                mywindow = window.open('', title, '');
                mywindow.document.write('<html><head><title>' + title + '</title>');
                mywindow.document.write('</head><body style="display:block;background:#FFF;">');
                mywindow.document.write(data);
                mywindow.document.write('</body></html>');
                mywindow.print();
                mywindow.close();
            });
        }
    }
})
.directive('newTab', function () {
    /*----------------------------------------------
    | TO USE ON ANY TAG
    |
    | opens the link provided in the attribute's value
    | in a new tab
    |
    | attribute new-tab="http://www.example.com"
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                close_menu();
                e.stopPropagation();
                e.preventDefault();
                new_tab(element.attr('href'));
            });
        }
    }
})
.directive('stopPropagation', function ($location) {
    /*----------------------------------------------
    | TO USE ON ANY TAG
    |
    | stops event's sub elements propagation on click
    |
    | attribute stop-propagation
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    }
})
.directive('dropdown', function(Dropdown){
    /*----------------------------------------------
    | TO USE ON THE CUSTOM DROPDOWN
    |
    |   <div class="dropdown-frame">
    |       <div class="dropdown-group" dropdown="CATEGORY" before="" after="" obj="" display="keys">
    |           <div class="dropdown-title"><span class="title">{{ (filter.category == '') && 'CATEGORY' || filter.category }}</span><i class="open"></i></div>
    |           <div class="dropdown-content" no-scroll>
    |               <div class="dropdown-option" value="key0" ng-click="custom_function(key0)">content</div>
    |               <div class="dropdown-option" value="key1" ng-click="custom_function(key1)">content</div>
    |               <div class="dropdown-option" value="key2" ng-click="custom_function(key2)">content</div>
    |           </div>
    |       </div>
    |   </div>
    |
    | attribute dropdown="DEFAULT" -> set default value
    | attribute before="Time: ", after=" hours" -> set the str around the data: Time: 10 hours
    | attribute obj="time.hour" -> set scope variable that is binded to this dropdown
    | optional attribute display="keys" -> defines if dropdown title displays de value attr or content of each option (content by default)
    ----------------------------------------------*/
    return {
        restrict:'A',
        link: function (scope, element, attr) {
            // functions
            $(window).click(function(){Dropdown.close_all();});
            // set default value
            if(attr.dropdown){
                $(element).children('.dropdown-title').children('.title').html(attr.dropdown);
            }
            // dropdown click
            element.bind('click', function (e) {
                e.stopPropagation();
                $target = $(e.target);
                $target_value = $target.attr('value');
                if(attr.display == 'keys' && $target_value != ''){$target_text = $target_value;}
                else{$target_text = $target.text();}
                $content = $(element).find('.dropdown-content');
                $title = $(element).find('.dropdown-title');
                
                if($target.hasClass('dropdown-option')){ // option
                    if(!$target.hasClass('no-option')){
                        $title.children('.title').html(attr.before + $target_text + attr.after);
                        // SAVE DATA
                        if(attr.obj == '' || attr.obj == undefined){
                            //dev.log('undef');
                        }
                        else if(attr.obj.indexOf('.') === -1){
                            scope[attr.obj] = ($target_value);
                        }
                        else{
                            var group_object = attr.obj.split('.')[0],
                                group_variable = attr.obj.split('.')[1];
                            scope[group_object][group_variable] = ($target_value);
                        }
                        scope.$apply();
                    }
                    Dropdown.close($title, $content);
                }
                else{ // just open/close
                    if($content.css("display") == "none"){Dropdown.open($title, $content);}
                    else{Dropdown.close($title, $content);}
                }
            });
        }
    }
})
.directive('setTitle', function($timeout) {
    /*----------------------------------------------
    | TO USE ON DROPDOWN
    |
    | sets the title after the ng-repeat is done loading all the options
    |
    | attribute set-title="TITLE"
    ----------------------------------------------*/
    return function(scope, element, attr) {
        if (scope.$last){
            $timeout(function () {
                $(element).parent().parent().children('.dropdown-title').children('.title').html(attr.setTitle);
            });
        }
    };
})
.directive('disable', function () {
    /*----------------------------------------------
    | TO USE ANY TAG (A TAGS IN GENERAL)
    |
    | disables the default action and propagation
    |
    | attribute <a href="/home" disable>
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    }
})
.directive('trigger', function () {
    /*----------------------------------------------
    | TO USE ON ANY TAG THAT TRIGGERS ANOTHER TAG'S CLICK EVENT
    |
    | triggers the click event of a tag by entering its css selector
    | as an attribute.
    |
    | attribute trigger="#file"
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(attr.trigger).click();
            });
        }
    }
});