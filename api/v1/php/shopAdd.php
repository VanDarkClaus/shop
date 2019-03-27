<?php
  include("db.php");
  $shopName=$_POST["shopName"];
  $shopPrice=$_POST["shopPrice"];
  $shopNum=$_POST["shopNum"];
  $jSql="select name from shop where name='$shopName'";//判断注册账号是否存在；
  $judge=mysql_query($jSql);
  $count=mysql_num_rows($judge);//得到资源行数
  
  if($count==0){
  	$sql="insert into shop (name,price,num,del) values ('$shopName','$shopPrice','$shopNum','1')";//插入到数据库，返回布尔值。
    $res=mysql_query($sql); 
    if($res){
    	echo json_encode(array("res_code"=>"1","res_message"=>"插入成功"));
    }else{
    	echo json_encode(array("res_code"=>"0","res_message"=>"网络错误"));
    }
  }else{
  	echo json_encode(array("res_code"=>"2","res_message"=>"商品已存在"));
  }
?>