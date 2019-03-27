<?php
  include("db.php");
  $id=$_POST["id"];
  $sql="delete from shop where id='$id'";
  $res=mysql_query($sql);
  $res=$res?1:0;
  echo json_encode($res);
?>