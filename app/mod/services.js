angular.module('Services', [])
/*
|--------------------------------------------------------
| SERVICES
|--------------------------------------------------------
*/
.factory('Dropdown', function($rootScope){
    return {
        open: function(title, content){
            // close all other around
            $('.dropdown-content').slideUp(200);
            $('.close').addClass('open').removeClass('close');
            // open this one
            content.slideDown(200);
            title.children('.open').addClass('close').removeClass('open');
        },
        close: function(title, content){
            // close this one
            content.slideUp(200);
            title.children('.close').addClass('open').removeClass('close');
        },
        close_all: function(){
            $('.dropdown-content').slideUp(200);
            $('.close').addClass('open').removeClass('close');
        }
    }
})
.factory('Auth', function($http, $rootScope){
    //----------------------
    // USER AUTHENTIFICATION
    //----------------------
    return {
        status_secure: function(boot, shut){
            $http.get(base_url('sessions/get/currentuser'))
                .error(function(response){
                    dev.log({'get_user_session':response});
                })
                .then(function(response){
                    //dev.log({'get_user_session':response});
                    if(response.data.error){
                        $rootScope.user = {};
                        $rootScope.connected = false;
                        $rootScope.cart_init();
                        if(shut != undefined){
                            shut(response);
                        }
                        else{
                            $rootScope.navigate('/');
                        }
                    }
                    else{
                        $rootScope.user = response.data.result;
                        $rootScope.connected = true;
                        $rootScope.cart = response.data.result.basket_product_qty;
                        $rootScope.donation = response.data.result.user_account_dollars;
                        if(boot != undefined){
                            boot(response);
                        }
                        else{
                            $rootScope.rootscope_init();
                        }
                    }
                });
        },
        status: function($scope){
            $http.get(base_url('sessions/get/currentuser'))
                .error(function(response){
                    //dev.log({'get_user_session':response});
                })
                .then(function(response){
                    //dev.log({'get_user_session':response});
                    if(response.data.error){
                        $rootScope.user = {};
                        $rootScope.connected = false;
                        $rootScope.cart_init();
                    }
                    else{
                        $rootScope.user = response.data.result;
                        $rootScope.connected = true;
                        $rootScope.cart = response.data.result.basket_product_qty;
                        $rootScope.donation = response.data.result.user_account_dollars;
                    }
                });
        }
    }
})
.factory('formData',function(){
    function formData($scope){
        this.$scope=$scope;
        if(!window.FormData){
            alert_modal("Your browser does not support FormData, try to update it");
        }
        else{
            this.form=new FormData();
        }
    }
    formData.prototype.setData=function(datas){
        for(data in datas){
            this.form.append(data,datas[data]);
            // if(typeof datas[data]==='object'){
            //     dev.log(datas[data]);
            //     if(datas[data].length !=undefined){
            //         dev.log("array");
            //         if(datas[data].length>0){
            //             for(var i=0;i<datas[data].length;i++){
            //                 var elem=datas[data][i];
            //                 for(key in elem){
            //                     this.form.append(data+"["+i+"]["+key+"]",elem[key]);
            //                 }
            //             }
            //         }
            //     }
            //     else{
            //         dev.log("json");
            //        for(key in datas[data]){
            //             this.form.append(data+"["+key+"]",datas[data][key]);
            //         } 
            //     }
            // }
            // else{
            //     this.form.append(data,datas[data]);
            // }
        }
    }
    formData.prototype.setFile=function(files, field){
        //var files=fileInput[0].files;
        if(files.length!=0){
            this.form.append('image',files[0]);
            this.form.append('field',field);
        }    
    }
    formData.prototype.send=function(url,callback,progressFunction){
        var xhr = new XMLHttpRequest();
        xhr.open('POST',url); 
        progress={};
        var self=this;
        xhr.onload = function() {
                if (callback && typeof(callback) === "function") {  
                    self.$scope.$apply(function(){
                        //dev.log(xhr.response);
                        callback.call(this,JSON.parse(xhr.response));
                    });
                }
        };
        xhr.upload.onprogress = function(e) {
                progress.value = e.loaded;
                progress.max = e.total;
                //console.log(progress);
                if (progressFunction && typeof(progressFunction) === "function") {
                    self.$scope.$apply(function(){
                        progressFunction.call(this,progress);
                    });
                }
        };
        xhr.send(this.form);
    }
    formData.prototype.put=function(url,callback,progressFunction){
        this.form.append('_method', 'PUT')
        var xhr = new XMLHttpRequest();
        xhr.open('PUT',url); 
        progress={};
        var self=this;
        xhr.onload = function() {
                if (callback && typeof(callback) === "function") {  
                    self.$scope.$apply(function(){
                        //dev.log(xhr.response);
                        callback.call(this,JSON.parse(xhr.response));
                    });
                }
        };
        xhr.upload.onprogress = function(e) {
                progress.value = e.loaded;
                progress.max = e.total;
                //dev.log(progress);
                if (progressFunction && typeof(progressFunction) === "function") {
                    self.$scope.$apply(function(){
                        progressFunction.call(this,progress);
                    });
                }
        };
        xhr.send(this.form);
    }
    return  formData;
})
.factory('formDataObject', function() {
    return function(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    };
});
