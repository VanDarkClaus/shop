<?php
  include("db.php");
  $user=$_POST["user"];
  $psw=$_POST["psw"];//接收参数
  $jSql="select username from users where username='$user'";//判断注册账号是否存在；
  $judge=mysql_query($jSql);
  $count=mysql_num_rows($judge);//得到资源行数
  
  if($count==0){//如果账号不存在，则插入
  	$sql="insert into users (username,password) values ('$user','$psw')";//插入到数据库，返回布尔值。
  	$res=mysql_query($sql);
  	$res=$res?"1":"0";
  	echo json_encode($res);//1为插入成功，注册成功，0插入失败，注册失败。
  }else{//如果账号已存在。
  	echo "2";
  }
?>