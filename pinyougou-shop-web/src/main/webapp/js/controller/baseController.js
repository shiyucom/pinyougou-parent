 //品牌控制层 
app.controller('baseController' ,function($scope){


    //重新加载列表 数据
    $scope.reloadList=function(){
    	//切换页码  
    	$scope.search( $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);	   	
    }
    
	//分页控件配置 
	//currentPage:当前页
	//totalItems：总记录数
	//itemsPerPage:每页记录数
	//perPageOptions:分页选项
	//onChange：当页码变更后自动触发的方法
	$scope.paginationConf = {
         currentPage: 1,
         totalItems: 10,
         itemsPerPage: 10,
         perPageOptions: [10, 20, 30, 40, 50],
         onChange: function(){
        	 $scope.reloadList();//重新加载
     	 }
	}; 
	
	$scope.selectIds=[];//用户勾选的ID集合

	//当用户进行勾选操作的时候将id存放到数组中
	$scope.updateSelection = function($event, id) {		
		//$event.target:获取到操作的元素的对象
		if($event.target.checked){//如果是被选中,则增加到数组
			$scope.selectIds.push( id);	//push向集合添加元素			
		}else{
			var idx = $scope.selectIds.indexOf(id);//查询id在数组中的位置
            $scope.selectIds.splice(idx, 1);//从数组中删除数据
		}
	}
	
	//json串转化成字符串
	$scope.jsonToString=function(jsonString,key){
		
		var json= JSON.parse(jsonString);
		var value="";
		
		for(var i=0;i<json.length;i++){
			if(i>0){
				value+=",";
			}			
			value +=json[i][key];			
		}
				
		return value;
	}
	
	//在list集合中根据某key的值查询对象
	//list：[ 	{"attributeName":"网络制式","attributeValue":["移动4G"]}  ]
	//key:attributeName
	//keyvalue:网络制式
	$scope.searchObjectByKey=function(list,key,keyValue){
		
		//遍历集合
		for(var i=0;i<list.length;i++){
			//拿着每个元素的key的值和传递过来的进行比较
			//list[i]:{"attributeName":"网络制式","attributeValue":["移动4G"]}
			//list[i][key]:网络制式
			if(list[i][key]==keyValue){
				return list[i];//{"attributeName":"网络制式","attributeValue":["移动4G"]}
			}			
		}
		return null;		
	}
});	