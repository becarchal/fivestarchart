/// <reference path="jquery.js"/>


/*
 * Array
 * */

Array.prototype.contains = function(item){
  return RegExp("\\b"+item+"\\b").test(this);
};

var Scene = {};
Scene.extend = function (o) {
    return o;
};

var tool = Scene.extend({
	cookie_prev:"smz_16cny_",
	getCookie:function(name){
		name=this.cookie_prev+name;
	    var preg = new RegExp("(^| )"+name+"=([^;]*)(;|$)","g");
	    if(preg.test(document.cookie)){
	            return RegExp.$2;
	    }else{
	            return "";
	    }
	},
	setCookie:function(name,value,days,path){
		name=this.cookie_prev+name;
	    var t = new Date(),
	              sCookie= name + "=" + escape(value);
	    if(days){
	    	t.setTime(t.getTime()+days*24*3600*1000);
	    	sCookie += ";expires="+t.toGMTString();
	    }
	    if(path){
	            sCookie += ";path="+path;
	    }
	    document.cookie = sCookie;
	},
	setSession:function(key,val){
		sessionStorage[key]=JSON.stringify(val);
	},
	getSession:function(key){
		if(sessionStorage[key])
			return JSON.parse(sessionStorage[key]);
		return null;
	},
	random:function(min,max,t){
		if(t=="f")
			return this.randomFloat(min,max);
		return this.randomInteger(min,max);
	},
	randomInteger:function(low, high)
	{
		return Math.floor(Math.random()*(high-low+1)+low);
	    //return low + Math.floor(Math.random() * (high - low));
	},
	randomFloat:function(low, high)
	{
	    return low + Math.random() * (high - low);
	},
	pixelValue:function(value)
	{
	    return value + 'px';
	},
	durationValue:function(value)
	{
	    return value + 's';
	},
    getTimespan:function(){
    	return (new Date()).valueOf();
    },
    urlParam:function(v){
    	var value = location.search.match(new RegExp("[\?\&]" + v + "=([^\&]*)(\&?)", "i"));
    	return value ? decodeURIComponent(value[1]) : "";
    }
    
});




