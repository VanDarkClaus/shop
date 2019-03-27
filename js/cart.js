class Cart{
	constructor(main){
		this.storage=JSON.parse(localStorage.getItem("cart"));//获取到本地缓存
		this.main=main;
		this.table=main.querySelector("table");
		this.tbody=main.querySelector("tbody");
		this.allCheck=main.querySelector(".allCheck");//全选
		this.reCheck=main.querySelector(".reCheck");//反选
		this.sumSpan=main.querySelector("#sum");//求和
		this.n=0;
		this.init();
	}
	init(){//初始化
		this.insert();
		this.entrust();//check事件委托
		this.sum()//求总价
	}
	insert(){//插入操作
		this.tbody.innerHTML="";
		this.storage.forEach((item)=>{
			this.tbody.innerHTML+=`
			<tr>
	         	<td><input type="checkbox" name="" class="aCheck" value="" /></td>
	         	<td>${item.id}</td>
	         	<td><span>${item.name}</span></td>
	         	<td><span>${item.price}</span></td>
	         	<td>
	         	<span class="num">${item.num}</span>
         	     <span class='glyphicon glyphicon-menu-up'></span>
         	     <span class='glyphicon glyphicon-menu-down'></span>
         	     <input type="text" class="input"/>
	         	</td>
	         	<td><button class='edit btn-primary'>编辑</button>
	         	    <button class='delete btn-danger'>删除</button>
	         	    <button class='confirm btn-success'>确定</button>
	         	    <button class='cancel btn-info'>取消</button>
	         	</td>
		  	</tr>
			`;
			this.aCheck=Array.from(this.main.querySelectorAll(".aCheck"));//单选
		})
	}
	entrust(){//check事件委托
		this.table.onclick=(e)=>{
			e=e||event;
			this.target=e.target||e.srcElement;
			this.tr=this.target.parentNode.parentNode;
			this.id=this.tr.children[1].innerHTML;
			this.span=this.tr.querySelector(".num");
			this.input=this.tr.querySelector(".input");
			switch(this.target.className){
				case "allCheck":this.allClick();break;
				case "reCheck":this.reClick();break;
				case "aCheck":this.aClick();break;
				case "glyphicon glyphicon-menu-up":this.addClick();break;
				case "glyphicon glyphicon-menu-down":this.reduceClick();break;
				case "delete btn-danger":this.deleteClick();break;
				case "edit btn-primary":this.editClick();break;
				case "confirm btn-success":this.confirmClick();break;
				case "cancel btn-info":this.cancelClick();break;
			}
			this.sum();
		}
	}
	allClick(){//全选
		this.n=this.allCheck.checked?this.aCheck.length:0;//设置计数器this.n
		this.aCheck.forEach((item)=>{
			item.checked=this.allCheck.checked;
		})
	}
	reClick(){//反选
		this.n=this.aCheck.length-this.n;
		this.aCheck.forEach((item)=>{
			item.checked=!item.checked;
		})
		this.allCheck.checked=this.n==this.aCheck.length?true:false;//判断反选后是否全选
	}
	aClick(){//单选
		if(this.target.checked){
			this.n++;
		}else{
			this.n--;
		}
		this.allCheck.checked=this.n==this.aCheck.length?true:false;
	}
	sum(){//求总价
		let sum=0;
		this.aCheck.forEach((item)=>{
			if(item.checked){
				let tr=item.parentNode.parentNode,
				price=tr.children[3].innerText,//单价
				num=tr.children[4].children[0].innerHTML;//数量
				sum+=price*num;
			}
		})
		this.sumSpan.innerHTML=sum;
	}
	addClick(){//+1
		this.storage.forEach((item)=>{
        	if(item.id==this.id){
        		item.num++;
        	}
       })
		localStorage.setItem("cart",JSON.stringify(this.storage));//存入
        this.storage=JSON.parse(localStorage.getItem("cart"));//从新获取缓存
	    this.span.innerHTML=Number(this.span.innerHTML)+1;
	}
	reduceClick(){//减1
		this.storage.forEach((item)=>{
        	if(item.id==this.id){
        		if(--item.num==0){
        			this.deleteClick();
        		}
        	}
       })
		localStorage.setItem("cart",JSON.stringify(this.storage));//存入
        this.storage=JSON.parse(localStorage.getItem("cart"));//从新获取缓存
	    this.span.innerHTML=Number(this.span.innerHTML)-1;
	}
	deleteClick(){//删除，删除localStorage从新渲染
		//先获取到id
		let value=this.tr.children[0].firstChild;
        this.storage.forEach((item,index)=>{
        	if(item.id==this.id){
        		if(confirm("确定删除")){
        			this.storage.splice(index,1);
        			this.target.parentNode.parentNode.remove();
        			if(value){//如果按钮选中，this.n--
        				this.n--;
        			}
        		}
        	}
        })
        this.aCheck=Array.from(this.main.querySelectorAll(".aCheck"));//从新获取单选
        
        localStorage.setItem("cart",JSON.stringify(this.storage));//设置缓存
        this.storage=JSON.parse(localStorage.getItem("cart"));//从新获取缓存
	}
	editClick(){//编辑按钮
		this.tr.classList.add("change");
		this.input.value=this.span.innerHTML;
	}
	confirmClick(){//确定按钮
		this.tr.classList.remove("change");
		if(tools.regNum(this.input)){
			this.span.innerHTML=this.input.value;
			this.storage.forEach((item)=>{
				if(item.id==this.id){
					item.num=this.span.innerHTML;
				}
			})
			localStorage.setItem("cart",JSON.stringify(this.storage));
		}else{
			alert("请输入整数");
		}
	}
	cancelClick(){//取消按钮
		this.tr.classList.remove("change");
	}
}
new Cart(document.querySelector("main"));
