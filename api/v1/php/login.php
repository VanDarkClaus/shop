<?php
  include("db.php");
  $user=$_POST["user"];
  $psw=$_POST["psw"];
  $sql="select * from users where username='$user' and password='$psw'";
  $res=mysql_query($sql);
  $count=mysql_num_rows($res);//获取返回值；
$count=$count>0?1:0;
echo json_encode($count);
?>