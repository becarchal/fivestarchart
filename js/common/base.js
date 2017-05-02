/// <reference path="jquery.js"/>
var Scene = {};
Scene.extend = function (o) {
    return o;
}
Array.prototype.remove = function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    this.splice(dx,1); 
} 

var page = Scene.extend({
    obj: null,
    width: parseInt(document.body.clientWidth),
    height: parseInt(document.body.clientHeight),
    yingyongclick: function(){
      $('#yingyong').click(function(){
          $('#sideBar').toggle();
      })
      $('#sideBarMask').click(function() {
         $('#sideBar').hide();
      })
    },
    sideBarItemClick: function() {
      var values = '';
      $('#sideBarContent > p').click(function() {
        values = $(this).html();
        console.log('-------------------', values);
        $('#sideBar').hide();
      })
    },
    resize:function (){
    	var w=$(window).width();
      var h=$(window).height();
      var rate=w/this.obj.width();
      this.obj.css("transform","scale("+rate+")");
      this.obj.css("-webkit-transform","scale("+rate+")");
      this.obj.css("top",667*(rate-1)/2);
      this.obj.css("marginLeft", -w/2);
	},
	setCondition:function(){
		sessionStorage.condition=JSON.stringify(this.condition);
	},
	getCondition:function(){
		if(sessionStorage.condition)
			this.condition=JSON.parse(sessionStorage.condition);
	},
	setCodeMapping:function(){
		sessionStorage.codeMapping=JSON.stringify(this.codeMapping);
	},
	getCodeMapping:function(){
		if(sessionStorage.codeMapping)
			this.codeMapping=JSON.parse(sessionStorage.codeMapping);
	},
	clearSession:function(){
		sessionStorage.clear();
	},
  init: function () {
    $(window).resize(function() {
      console.log(page.width);
      page.resize();
    });
      // self.getCondition();
      // self.getCodeMapping();
    this.obj = $('#wrapper');
    this.stripe = $('#main');
    this.resize();
    this.yingyongclick();
    this.sideBarItemClick();
  },
  formatYear:function(year){
    if(year[0]==""){
      if(year[1]!=""){
        year[0]=parseInt(year[1])-1+"年";
        year[1]+="年";
      }
        
    }else{
      if(year[1]==""){
        year[1]=parseInt(year[0])+1;
      }
      year[1]+="年";
      year[0]+="年";
    }
    if(year[0]=="")
      year[0]="无数据";
    if(year[1]=="")
      year[1]="无数据";
    return year;
  }
});



//类别选项

function compare(propertyName) {
	return function (object1, object2) {
	var value1 = object1[propertyName]; 
	var value2 = object2[propertyName]; 
		if (value2 < value1) { 
			return -1; 
		} 
		else if (value2 > value1) { 
			return 1; 
		} 
		else { 
			return 0; 
		} 
	}
}


function compare2(propertyName) {
	return function (object1, object2) {
	var value1 = object1[propertyName]; 
	var value2 = object2[propertyName]; 
		if (value2 < value1) { 
			return 1; 
		} 
		else if (value2 > value1) { 
			return -1; 
		} 
		else { 
			return 0; 
		} 
	}
}

page.init();

/*$.get("http://10.10.133.33:8000/dashboard/dashboard.xsodata/regioninfo?$format=json",{},function(data){
	console.log(1);
	console.log(data);
},"json");*/
//console.log(parseFloat("5.931034482758621"));