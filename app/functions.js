function base_url(url){
    return config.base_url + url
}
function new_tab(url){
    var window_url = window.open(url, '_blank');
    window_url.focus();
}
function all_true(obj){
    for(element in obj){
        if(!obj[element]){
            return false
        }
    }
    return true
}
var dev = {
    mode:true,
    user_mode:true,
    type:'error', // error, http
    error_mode:function(){dev.type = 'error';console.log('error mode activated.');},
    http_mode:function(){dev.type = 'http';console.log('http mode activated.');},
    log:function(log){if(dev.mode){console.log(log)}},
    user_log:function(log){if(dev.mode){console.log(log)}},
    error:function(log){if(dev.mode && dev.type == 'error'){console.log({'error':log})}},
    http:function(log){if(dev.mode && dev.type == 'http'){console.log({'http response':log})}},
};
function defined_default(value, default_value){
    return (typeof value !== 'undefined') ? value : default_value
}
//preview
function createPreview(file,preview){
        var reader = new FileReader();
        reader.onload = function() {
            preview.css('background-image','url('+this.result+')');             
        };
         
        reader.readAsDataURL(file);
}
var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
function showPreview(files,preview){
    hasChanged=true;
    if(window.File && window.FileList && window.FileReader){
        if(files!=undefined){
            for(var i=0;i<files.length;i++){
                var file=files[i];
                
                var imgType = file.name.split('.');
                imgType = imgType[imgType.length - 1];
                 
                if(allowedTypes.indexOf(imgType) != -1) {
                    createPreview(file,preview);
                }
                else{
                    alert("wrong format");
                }
            }
        }
    }
    else{
        alert_modal("Preview and upload picture not yet supported for this browser, try to update your browser");
    }
}
function array2str(input, separator){
    separator = defined_default(separator, ', ');
    if(input == undefined){return ''}
    else if(typeof(input) == typeof('string')){return input}
    else if(typeof(input) == typeof(1989)){return input.toString()}
    else if(typeof(input) == typeof(['array']) || typeof(input) == typeof({object:'object'})){
        var output = '';
        var counter = 0;
        for(var i in input){
            if(typeof(input[i]) == typeof('string')){
                output += input[i];
                if(counter < (input.length - 1)){
                    output += separator;
                }
            }
            else if(typeof(input) == typeof(['array']) || typeof(input) == typeof({object:'object'})){
                output += array2str(input[i]);
                if(counter < (input.length - 1)){
                    output += separator;
                }
            }
            counter++;
        }
        return output
    }
    else{return input.toString()}
}
function defined_default(value, default_value){
    return (typeof value !== 'undefined') ? value : default_value
}
//-------------
// PAGE SYSTEM
//-------------
function pageSystem(pageLimit, elemLimit, update){
    this.currentPage = 0;
    this.totalPages = 1;
    this.limit = pageLimit; // number of pages
    this.limit_backup = pageLimit; // number of pages
    this.elem_limit = defined_default(elemLimit, 10); // elements / page
    this.callback = defined_default(function(){
        update();
    }, function(){console.log('no function defined.');});
    // change page
    this.update = function(page){
        this.currentPage = page;
        this.callback();
    };
    this.next = function(){
        if(this.currentPage < (this.totalPages - 1)){this.currentPage++;}
        this.callback();
    };
    this.previous = function(){
        if(this.currentPage > 0){this.currentPage--;}
        this.callback();
    };
    this.first = function(){
        this.currentPage = 0;
        this.callback();
    };
    this.last = function(){
        this.currentPage = this.totalPages-1;
        this.callback();
    };
    this.repeat = 0;
    // get number
    this.getNumber = function(num) {
        //total number of pages dependency
        if(this.totalPages > this.limit){
            var list = new Array(this.limit);
        }
        else{
            var list = new Array(num);
        }
        // current page dependency
        if(this.currentPage < Math.ceil(this.limit/2)){
            var start = 0;
        }
        else if(this.currentPage > (this.totalPages - Math.ceil(this.limit/2))){
            var start = this.totalPages - this.limit;
        }
        else{
            var start = this.currentPage - Math.floor(this.limit / 2);
        }
        // pages list
        var count = 0;
        for(var i = 0, n = list.length; i < n; i++){
            list[i] = start + count;
            count ++;
        }
        return list
    };
    this.total = function(total){
        if(total != undefined){
        this.totalPages = Math.ceil( total / this.elem_limit);
        }
        if(this.totalPages < this.limit){
            this.limit = this.totalPages;
        }
        else{
            this.limit = this.limit_backup;
        }
        this.repeat = this.getNumber(this.totalPages);
    };
    this.offset = function(){
        return this.currentPage * this.elem_limit
    };
}
function fk_carrousel(full_data, number_elements, loop){
    /*
    INPUT:
    (*) ADD LATER: limit_total objects..
    (1) FULL DATA: obj/array/... all data that has to be in the carrousel
    (2) NUMBER ELEMENTS: number of entities in one carrousel's page
    (3) LOOP: if loop, never returns empty (boxes).
    */
    // DATA
    this.data = [];
    for(i in full_data){
        this.data.push(full_data[i]);
    }
    // PARAMETERS
    this.num_obj = this.data.length;
    this.limit = defined_default(number_elements, 3);
    this.loop = defined_default(loop, true);
    this.offset = 0;
    this.num_loops = Math.floor(this.num_obj / number_elements);
    this.carrousel = [];
    // SET NEW ARRAY OF DATA
    var tmp_array = [];
    var x = 0;
    for(var loop = 0; loop < this.num_loops; loop++){
        tmp_array = [];
        for(var i = 0; i < this.limit; i++){
            tmp_array[i] = this.data[x];
            x++;
        }
        this.carrousel.push(tmp_array);
    }
    // IF NOT ROUND ADD LAST
    if(this.num_obj % number_elements != 0){
        this.num_loops++;
        tmp_array = [];
        for(var i = 0; i < this.limit; i++){
            if(x >= this.num_obj){
                if(this.loop){
                    x = 0;
                }else{break;}
            }
            tmp_array[i] = this.data[x];
            x++;
        }
        this.carrousel.push(tmp_array);
    }
    //console.log(this.carrousel);
    this.next = function(){
        if(this.offset >= (this.num_loops - 1)){this.offset = 0;}
        else{
            this.offset++;
        }
        //console.log(this.carrousel[this.offset]);
        return this.carrousel[this.offset];
    };
    this.previous = function(){
        if(this.offset <= 0){this.offset = this.num_loops - 1;}
        else{this.offset--;}
        return this.carrousel[this.offset];
    };
    this.reset = function(){
        this.offset = 0;
        return this.carrousel[this.offset];
    };
}
function PrintElem(elem)
{
    Popup($('<div/>').append($(elem).clone()).html());
}

function Popup(data) 
{
    var mywindow = window.open('', 'Print Gift Card', 'height=400,width=400');
    mywindow.document.write('<html><head><title>Print Gift Card</title>');
    //mywindow.document.write('<link rel="stylesheet" href="css/style.css" type="text/css" />');
    mywindow.document.write('</head><body>');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();
    return true;
}