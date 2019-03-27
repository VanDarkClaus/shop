var tools={
	/*获得style属性值函数
	@param obj DOMObj第一个值为DOM对象
	@param attr String第二个值为string,及对象的属性（key）；
	return String返回得到的样式值
	*/
	getStyle:function(obj,attr){
			return obj.currentStyle ? 
			obj.currentStyle[attr] : 
			getComputedStyle(obj, false)[attr];
	},

	/*回到顶部函数
	 * @param element //传入一个从html获取到的元素
	 */
	comTop: function(element) {
		element.onclick = function() { //绑定点击事件
			var time = null; //设置time接收定时器，同时初始化；
			time = setInterval(function() {
				var top = document.body.scrollTop || document.documentElement.scrollTop; //兼容
				document.body.scrollTop ? document.body.scrollTop -= top / 4 :
					document.documentElement.scrollTop -= top / 4; //设置速度
				if(top == 0) {
					clearInterval(time);
				}
			}, 40) //设置定时器，@param为间隔，单位ms
		}
	},

	/*计算一个元素到body边缘距离
	 * @param obj DOMobj要计算的dom元素
	 * @return object{left,top}
	 */
	getBodyDis: function(domObj) {
		var top=0,left=0;
    while(domObj.offsetParent !=null){
    	top+=domObj.offsetTop;
    	left+=domObj.offsetLeft;
    	domObj=domObj.offsetParent;
    }
    return{
    	"top":top,
    	"left":left
    }
	},
	/*得到屏幕宽高
	 * @return 返回一个数组width,和height
	 */
	getScreenWH: function(){
		return{
			width:document.documentElement.clientWidth ||document.body.clientWidth,
			height:document.documentElement.clientHeight||document.body.clientHeight
		}
	},
	/*滚轮事件（兼容）
	 * @param obj  元素
	 * @param fn 执行的函数
	 */
	mouseWheel: function(obj,fn){
            if(obj.onmousewheel !== undefined){
            	obj.onmousewheel=function(e){
            		e=e||event;
            		e.wheelDelta>0?fn("up"):fn("down");
            	}
            }else{
				obj.addEventListener("DomMouseScroll",function(e){
					e=e||event;
					e.detail>0?fn("up"):fn("down");
				});
			}
		},
	/*监听事件 addEventListener(兼容)
	 * @param obj一个元素
	 * @param type绑定事件句柄，不加on,输入字符串""
	 * @param fn 函数;
	 * @param [isCapture]可填选项true/false，默认false
	 */
	addEL:function(obj,type,fn,isCapture){
		isCapture===undefined?false:isCapture;
		if(obj.addEventListener){
			obj.addEventListener(type,fn,isCapture);
		}else{
			obj.attachEvent("on"+type,fn)//ie没有第三个参数；
		}
	},
	/*删除监听removeEventListener(兼容)
	 * @param obj 元素
	 * @param type 事件句柄
	 * @param fn 返回函数，可在删除后执行一些操作
	 */
	removeEL:function(obj,type,fn){
		console.log(obj.removeEventListener)
		if(obj.removeEventListener){
			obj.removeEventListener(type,fn);
		}else{
			obj.detachEvent("on"+type,fn);
		}
	},
	/*阻止默认事件（兼容）
	 * @param e当前事件
	 * @param return返回阻止事件
	 */
	preventDefault:function(e){
		if(e.preventDefault){
			return e.preventDefault()
		}else{
			return window.event.returnValue=false;
		}
	},
	/*冒泡阻止（兼容）
	 * @param e当前事件
	 */
	cancelBobble:function(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble=true;//兼容ie
		}
	},
	/*让元素匀速运动
	 * @param obj dom元素
	 * @param attr string类型，运动的属性
	 * @param end 终点值
	 * @param time 运动时间
	 */
	moveL:function(obj,attr,end,time){
		clearInterval(obj.timer)
		var start = parseInt(this.getStyle(obj, attr));//获取到传入方向上元素的大小；
		var distance=end-start;//运动距离；
		var step=Math.floor(time/30);//步数；
		var speed=distance/step;//速度
		obj.timer=setInterval(function(){
			start+=speed;
			if(Math.abs(end-start)<=Math.abs(speed)){
				start=end;
				clearInterval(obj.timer);
			}
			obj.style.left=start+"px";
		},30)
	},
	/*让元素居中
	 * @param obj dom对象
	 */
	domCenter:function(obj){
		var _this=this;
		window.onresize=(function center(){
			var _left=(_this.getScreenWH().width-obj.offsetWidth)/2,
			_top=(_this.getScreenWH().height-obj.offsetHeight)/2;
			obj.style.left=_left+"px";
			obj.style.top=_top+"px";
			return center;
		})();
	},
	/*css属性的获取和设置
	 * @param obj 一个dom元素
	 * @param attr 当attr为字符时获取attr的属性；
	 * 当attr为属性时设置样式。
	 */
	cssGS:function(obj,attr){
		if(typeof attr==="string"){
			this.getStyle(obj,attr);
		}else if(typeof attr==="object"){
			for(var key in attr){
				obj.style[key]=attr[key];
			}
		}
	},
	/*cookie的存取，只有key为取出
	 * @param key string 存放key的值
	 * @param [value] string 存放属性值
	 * @param [object]{"path":"/";"expires":3;} 可选属性，设置
	 * return string 取cookie时返回value
	 */
    cookie:function(key,value,object){
    	if(value === undefined){//value未定义，取值
    		var obj={};
    		let getCookie=document.cookie;//获取cookie；
    		let arr=getCookie.split("; ");//将cookie变为类数组对象
    	    arr.forEach(function(item){//遍历
    	    	let substr=item.split("=");//将cookie等号分割；
    	    	obj[substr[0]]=decodeURIComponent(substr[1]);//赋值给变为对象
    	    })
    	    return obj[key]?JSON.parse(obj[key]):"";
    	}
    	else{//反之value存在，则存数据。
    		let str=key+"="+encodeURIComponent(JSON.stringify(value));
    		if(object){
    			if(object.path){
    				str+=";path="+object.path;
    			}
    			if(object.expires){
    				let date=new Date();
    				date.setDate(date.getDate()+object.expires);
    				str+=";expires="+date;
    			}
    		}
    		document.cookie=str;
    	}
    },
    /*ajax请求get
     * @param url string  请求的路径
     * @param query object 请求的参数{},可以不传
     * @param succCb function 请求成功执行的函数
     * @param failCb function 请求失败执行的函数,可以不传
     * @param isJson boolean true:解析json false：不解析。默认为true，可以不传
     */
    ajaxGet:function(url,query,succCb,failCb,isJson){
    	var ajax=new XMLHttpRequest();//创建一个ajax
    	if(typeof query==="function"){//判断第二个参数是否存在，为function则不存在
    		ajax.open("GET",url,true);//建立连接
    		ajax.send(null);//发送信息，可以空
    		ajax.onreadystatechange=function(){
    			if(ajax.readyState===4){//监听，状态为4则返回成功
    				if(ajax.status===200){//状态码为200，则成功
    					if(failCb===undefined) failCb=true;
    					let res=failCb?JSON.parse(ajax.responseText):ajax.responseText;
    					query && query(res); 
    				}else{
    					succCb && succCb();
    				}
    			}
    		}
    	}else {//否则为存在
    		url+="?";
    		for(var key in query){//拼接发送信息
    			url+=key+"="+query[key]+"&";
    		}
    		url=url.slice(0,-1);
    		
    		ajax.open("GET",url,true);//建立连接
    		ajax.send(null);//发送请求
    		ajax.onreadystatechange=function(){//监听状态
    			if(ajax.readyState===4){
    				if(ajax.status===200){
    					if(isJson===undefined) isJson=true;
    					let res=isJson?JSON.parse(ajax.responseText):ajax.responseText;
    					succCb && succCb(res);
    				}else{
    					failCb && failCb();
    				}
    			}
    		}
    		
    		
    	}
	},
	/*ajax请求post
	*@param url string请求路径
	*@param query object 请求参数,可以不传
	*@param succCb function 执行成功函数
	*@param failCb function 执行失败函数
	*@param isJson boolean true:解析json false：不解析。默认为true，可以不传
	*/ 
	ajaxPost:function(url,query,succCb,failCb,isJson){
		var xhr=new XMLHttpRequest();//创建一个ajax
		if(typeof query==="function"){//第二个参数不存在
			xhr.open("POST",url,true);
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");//设置post头数据
			xhr.send(null);
			xhr.onreadystatechange=function(){
				if(xhr.readyState===4){
					if(xhr.status===200){
						failCb=failCb==undefined?true:failCb;
						query && query(failCb?JSON.parse(xhr.responseText):xhr.responseText);
					}else{
						succCb && succCb();
					}
				}
			}
		}else{//第二个参数存在
			xhr.open("POST",url,true);//建立连接
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");//设置post头数据
			let str="";//拼接字符串
			for(let key in query){
				str+=key+"="+query[key]+"&";
			}
			str=str.slice(0,-1);
			xhr.send(str);//发送数据
			xhr.onreadystatechange=function(){
				if(xhr.readyState===4){//监听
                    if(xhr.status===200){
						isJson=isJson==undefined?true:isJson;
                        succCb && succCb(isJson?JSON.parse(xhr.responseText):xhr.responseText);
					}else{
						failCb && failCb();
					}
			}
			
		}
	}
         
	},
	/*jsonp ajax请求
	 *  @param url string 请求路径
	 * @param cb string 全局函数名，必须，也可以传空，在第三个参数补上回调函数
	 * @param query object 请求参数
	 */ 
	ajaxJsonp: function(url,cb,query){
		  var script=document.createElement("script");
		  var str="";//拼接路径
		  str+=url+"?cb="+cb;//jsonp仅仅支持get
		  for(var key in query){
			  str+="&"+key+"="+query[key];
		  }
		  script.src=str;
		  document.body.appendChild(script);
		  document.body.remove(script);
	},
	/*使用Promise实现ajaxget请求
	 * @param url string
	 * @param query object一个对象
	 * @param isJson 是否转换成json
	 */
	ajaxGetPromise:function(url,query,isJson){
		return new Promise(function(resolve,reject){
			url+="?";
			if(query){//拼接字符串
				for(var key in query){
					url+=key+"="+query[key]+"&";
				}
				url=url.slice(0,-1);
			}
			var ajax=new XMLHttpRequest();
			ajax.open("GET",url,true);
			ajax.send(null);
			ajax.onreadystatechange=function(){
				if(ajax.readyState===4){
					if(ajax.status===200){
						if(isJson===undefined){
							isJson=true;
						}
						var res=isJson?JSON.parse(ajax.responseText):ajax.responseText;
						resolve(res);//请求成功
					}else{
						reject();//请求失败
					}
				}
			}
		})
	},
	/*验证小数
	 * @param dom输入一个dom元素
	 * @reutrn 返回布尔值
	 */
	regFloat: function(dom){
		let reg=/^(([0-9]+|0)\.([0-9]{0,})$)|^([0-9]+|0)$/;
		return reg.test(dom.value);
	},
	/*验证小数
	 * @param dom输入一个dom元素
	 * @reutrn 返回布尔值
	 */
	regNum: function(dom){//验证整数
		let reg=/^([0-9]+|0)$/;
		return reg.test(dom.value);
	}
}