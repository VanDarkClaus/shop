<?php
  $config=array(//数据库信息
     "host"=>"localhost",
     "username"=>"root",
     "password"=>"",
     "dbname"=>"1901"
  );
  mysql_connect($config["host"],$config["username"],$config["password"]);//连接数据库
  mysql_select_db($config["dbname"]);//表单

  mysql_query("set charset 'utf8'");//设置php和mysql之间连接编码方式
	mysql_query("set character set 'utf8'");
?>