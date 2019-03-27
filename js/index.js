class Nav{
	constructor(dom){
		this.dom=dom;
		this.welc=dom.querySelector("#welc")
		this.right=dom.querySelector("#right")
		this.init();
	}
	init(){
		this.loginHidden();//隐藏登录
		this.exitLogin();//退出登录
	}
	loginHidden(){//隐藏登录
		if(tools.cookie("login")){//如果登录信息存在
	       this.welc.classList.remove("hidden");
	       this.right.classList.add("hidden");
	       var login=tools.cookie("login");
	       this.welc.querySelector("a").innerHTML+=login.user;
	      }
	       else{
			 this.welc.classList.add("hidden");
	       this.right.classList.remove("hidden");
		}
		
	}
	exitLogin(){//退出登录,清除cookie即可
		this.welc.querySelectorAll("a")[1].onclick=()=>{
			if(confirm("确定退出吗")){
				tools.cookie("login","",{"path":"/","expires":-1});
			   this.loginHidden();
			}
		}
	}
}
new Nav(document.querySelector("nav"));

class Shop{
	constructor(main){
		this.main=main;
		this.table=main.querySelector("#shopTable");
		this.tbody=main.querySelector("tbody");
		
		this.mode=main.querySelector("#mode");
	    this.add1=main.querySelector("#inputAdd1");
	    this.add2=main.querySelector("#inputAdd2");
	    this.add3=main.querySelector("#inputAdd3");
	    this.nowPage=1;//当前页默认为1
	    this.sumPage=1;//总页数，初始值为1
	    this.lastLi=main.querySelector("#lastLi");
	    this.pagination=main.querySelector("#pagination");
	    this.add=main.querySelector("#add");
	    
		this.init();
	}
	init(){//初始化
		this.getShop();//查询当前页商品
		this.addShop();//插入商品
		this.entrust();//事件委托
		this.liEntrust();//委托分页
	}
	addCart(){//添加到购物车缓存
		let span=this.tr.querySelectorAll("span");
		let obj={
			id:this.tr.getAttribute("data-id"),
			name:span[0].innerHTML,
			price:span[1].innerHTML,
			num:1
		}
		if(localStorage.getItem("cart")){//如果本地缓存存在执行数量加1
			let cart=JSON.parse(localStorage.getItem("cart"));//获取到缓存
			let i=0;
			if(cart.some((item,index)=>{//如果该商品存在，执行+1
				i=index;
				return this.tr.getAttribute("data-id")==item.id;
			})){
				cart[i].num++;
			}else{//如果该商品不存在，向数组添加一个新的obj
				cart.push(obj);
			}
			localStorage.setItem("cart",JSON.stringify(cart));
		}else{//如果本地缓存不存在，新建一个
			localStorage.setItem("cart",JSON.stringify([obj]));
		}
	}
	addShop(){//添加商品
		this.mode.onclick=()=>{
			var shopName=this.add1.value;
			var shopPrice=this.add2.value;
			var shopNum=this.add3.value;
			if(tools.regNum(this.add2)&&tools.regNum(this.add3)){
				tools.ajaxPost("api/v1/php/shopAdd.php",{shopName,shopPrice,shopNum},(res)=>{
					if(res.res_code==1){
						this.add1.value="";
						this.add2.value="";
						this.add3.value="";
					
						$('#myModal').modal('hide');
						alert("插入成功");
						this.nowPage=this.sumPage+1;//插入后总页数++
						this.getShop();
					}
				})
			}
		}
	}
	getShop(){//查询商品列表,并渲染到页面中
		tools.ajaxPost("api/v1/php/get.php",{"nowPage":this.nowPage},(res)=>{
			this.tbody.innerHTML="";//删除上一次的值
			var {data}=res.res_body;//解构赋值
			this.nowPage=res.nowPage;
			this.sumPage=res.sumPage;
			data.forEach((item)=>{//渲染没列到页面中
				this.tbody.innerHTML+=`<tr data-id='${item.id}'>
		  	         	<td><p>${item.id}</p></td>
		  	         	<td><span>${item.name}</span><input type="text" value=""/></td>
		  	         	<td><span>${item.price}</span><input type="text" value="" /></td>
		  	         	<td><span>${item.num}</span><input type="text" value=""/></td>
		  	         	<td>
		  	         		<button class="btn btn-primary editBtn">编辑</button>
		  	         		<button class="btn btn-danger deleteBtn">删除</button>
		  	         		<button class="btn btn-success confirmBtn">确定</button>
		  	         		<button class="btn btn-info cancelBtn">取消</button>
		  	         		<button class="btn add">加入购物车</button>
		  	         	</td>
		  	         </tr>`;
			})
			Array.from(this.main.querySelectorAll(".delLi")).forEach(function(item){
				item.remove();
			})//删除li上一次的值
			for(let i=1;i<=this.sumPage;i++){//渲染li到页面中
				let li=document.createElement("li");
				li.innerHTML=`<a class="nowLi" href="#">${i}</a>`;
				li.className=i==this.nowPage?"active delLi":"delLi";
				this.pagination.insertBefore(li,this.lastLi);
			}
			
		})
	}
	entrust(){//事件委托
		this.tbody.onclick=(e)=>{
			e=e||event;
			this.target=e.target||e.srcElement;
		    this.tr=this.target.parentNode.parentNode;
			this.span=Array.from(this.tr.querySelectorAll("span"));
			this.id=this.tr.querySelector("p");
			switch(this.target.className){//委托4个按钮
				case "btn btn-primary editBtn":this.edit();break;
				case "btn btn-danger deleteBtn":this.del();break;
				case "btn btn-success confirmBtn":this.confirm();break;
				case "btn btn-info cancelBtn":this.cancel();break;
				case "btn add":this.addCart();break;
			}
			return false;
		}
	}
	liEntrust(){//委托分页
		this.pagination.onclick=(e)=>{
			e=e||event;
			this.target=e.target||e.srcElement;
			switch(this.target.className){
					case "preLi":
					if(--this.nowPage<1) this.nowPage=1;
					break;
					case "nowLi":
					this.nowPage=this.target.innerHTML;
					break;
					case "nextLi":
					if(++this.nowPage>this.sumPage)this.nowPage=this.sumPage;
					break;
			}
			this.getShop();//点击完后执行一次
			return false;
		}
	}
	edit(){//编辑事件
        this.tr.classList.add("edit");
        this.span.forEach((item)=>{
        	item.nextElementSibling.value=item.innerText;
        })
	}
	del(){//删除事件
		
		if(confirm("确定删除吗？")){
			this.tr.remove();
			tools.ajaxPost("api/v1/php/delete.php",{"id":this.id.innerHTML},function(res){
				alert(res?"删除成功":"删除失败");
			})
		}
		this.getShop();//点击完后执行一次
	}
	confirm(){//确定事件,执行更新
		this.tr.classList.remove("edit");
		var option=[];//设置数组储存input框的内容
		option.push(this.id.innerHTML);
		this.span.forEach((item)=>{
			option.push(item.nextElementSibling.value);
		})
		if(tools.regNum(this.tr.querySelectorAll("input")[2]) && tools.regNum(this.tr.querySelectorAll("input")[1])){
		this.span.forEach((item)=>{//修改页面的值
			item.innerHTML=item.nextElementSibling.value;
		})
		//修改数据库的值
		tools.ajaxPost("api/v1/php/update.php",{"id":option[0],"name":option[1],"price":option[2],"num":option[3]},function(res){
			alert(res?"修改成功":"修改失败");
		});
		}else{
			alert("请输入正确格式");
		}
	}
	cancel(){//取消事件
		this.tr.classList.remove("edit");
	}
}
new Shop(document.querySelector("#main"))
