<?php
  include("db.php");
  $nowPage=$_POST["nowPage"];
  $sumSql="select * from shop";//获取总页数，并判断当前和总页数的大小
  $numPage=ceil(mysql_num_rows(mysql_query($sumSql))/5);
  if($nowPage>$numPage)  $nowPage=$numPage;  
  
  $selPage=($nowPage-1)*5;//从第几页开始
  
  $sql="select * from shop limit $selPage, 5";
  $res=mysql_query($sql);
  $arr=array();
  while($row = mysql_fetch_assoc($res)){
  	array_push($arr,$row);
  }
  $resArr = array(
     'res_code'=>1,
     'res-message'=>"查询成功",
     'nowPage'=>$nowPage,
     'sumPage'=>$numPage,
     "res_body"=>array('data'=>$arr)
  );
  echo json_encode($resArr);
?>