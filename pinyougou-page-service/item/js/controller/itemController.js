//商品详细页（控制层）
app.controller('itemController',function($scope){
	
	//数量操作
	$scope.addNum=function(x){
		$scope.num=$scope.num+x;
		if($scope.num<1){
			$scope.num=1;
		}
	}
	
	//记录用户选择的规格，方便后期判断哪个规格选中了 ｛“网络”：“4G”,"机身内存"：“16G”｝
	$scope.specificationItems={};


	//用户选择规格
	//name：网络
	//value:4G
	$scope.selectSpecification=function(name,value){
		$scope.specificationItems[name]=value; //｛“网络”：“4G”,"机身内存"：“16G”｝
		searchSku();//读取 sku
	}
	
	//判断某规格选项是否被用户选中
	//name：网络
	//value:4G
	$scope.isSelected=function(name,value){
		//$scope.specificationItems[网络](4G) == 4G
		if($scope.specificationItems[name]==value){
			return true;
		}else{
			return false;
		}
	}
	
	//加载默认 SKU
	$scope.loadSku=function(){
		$scope.sku=skuList[0];
		//stringify : 将对象转化为json字符串
		//这个时候的效果不再是对象与对象操作，而是对象与字符串操作
		//JSON.parse : 将字符串转化为对象
		$scope.specificationItems= JSON.parse(JSON.stringify($scope.sku.spec)) ;
	}
	
	//匹配两个对象,true：根据规格的信息找到sku的信息，false：不相等，不应该显示数据
	//map1：sku的spec{"网络":"4G","机身内存"："16G"}
	//map2:$scope.specificationItems ｛“网络”：“4G”,"机身内存"：“16G”｝
	matchObject=function(map1,map2){
		for(var k in map1){
			if(map1[k]!=map2[k]){
				return false;
			}
		}
		for(var k in map2){

			if(map2[k]!=map1[k]){
				return false;
			}
		}
		return true;
	}
	
	//查询 SKU
	searchSku=function(){
		//判断选中的规格是否有对应的sku信息
		for(var i=0;i<skuList.length;i++ ){//遍历每一个sku，和规格进行对比，查看是否相等，是否应该显示
			if( matchObject(skuList[i].spec ,$scope.specificationItems ) ){
				$scope.sku=skuList[i];
				return ;
			}
		}
		$scope.sku={id:0,title:'--------',price:0};//如果没有匹配的
	}
	
	//添加商品到购物车
	$scope.addToCart=function(){
		alert('skuid:'+$scope.sku.id)
	}
	
});