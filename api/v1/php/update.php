<?php
  include("db.php");
  $id=$_POST["id"];
  $name=$_POST["name"];
  $price=$_POST["price"];
  $num=$_POST["num"];
  $sql="update shop set id='$id',name='$name',price='$price',num='$num' where id='$id'";
  $res=mysql_query($sql);
  $res=$res?1:0;
  echo json_encode($res);
?>