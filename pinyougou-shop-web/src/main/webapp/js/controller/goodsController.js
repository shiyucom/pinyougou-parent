 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				//var json = eval(response);
				$scope.list=response;
			}			
		);
	}    
// -------------------------------------------------------------------------------------------------
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
// --------------------------------------------------------------------------------------------------
	//查询实体 
	$scope.findOne=function(id){
		var id=$location.search()['id'];//点击goods.html中修改操作，跳转到goods_edit.html中，获取跳转路径中的id
		if(id==null){
			return ;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
				
				//向富文本编辑器添加商品介绍
				editor.html($scope.entity.goodsDesc.introduction);//商品介绍 
				//商品图片
				// JSON.parse:将json字符串转化为json对象    (对象){}="{}"(字符串)
				$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
				//扩展属性
				$scope.entity.goodsDesc.customAttributeItems=JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				//规格选择
				$scope.entity.goodsDesc.specificationItems= JSON.parse($scope.entity.goodsDesc.specificationItems);
				//转换sku列表中的规格对象
				//[ {spec},{spec} ]
				//spec : "{"机身内存":"16G","网络":"联通4G"}" = {"机身内存":"16G","网络":"联通4G"}
				for(var i=0;i< $scope.entity.itemList.length;i++ ){
					$scope.entity.itemList[i].spec=  JSON.parse($scope.entity.itemList[i].spec);					
				}
			}
		);				
	}
// --------------------------------------------------------------------------------------
	//保存 
	$scope.save=function(){				
		$scope.entity.goodsDesc.introduction=editor.html();
		
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					alert("新增成功");
					//$scope.entity={};
					//$scope.entity={goodsDesc:{itemImages:[],specificationItems:[]} };
					// 在图片和规格的时候需要初始化出来itemImages和specificationItems，否则再次操作时会找不到
					//editor.html("");//清空富文本编辑器
					location.href='goods.html';//跳转到goods.html页面
					
				}else{
					alert(response.message);
				}
			}		
		);			
	}
	// ------------------------------------------------------------------------------------------
	//增加商品 
	$scope.add=function(){

		//将富文本的数据设置给entity已便提交给服务器
		$scope.entity.goodsDesc.introduction=editor.html();


		goodsService.add( $scope.entity  ).success(
			function(response){
				if(response.success){
					alert("新增成功");
					$scope.entity={};//添加成功之后，清空输入框中的数据


					//$scope.entity={goodsDesc:{itemImages:[],specificationItems:[]} };
                    // 在图片和规格的时候需要初始化出来itemImages和specificationItems，否则再次操作时会找不到
					editor.html("");//清空富文本编辑器
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	// --------------------------------------------------------------------------------------------
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
// -----------------------------------------------------------------------------------------
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
// ---------------------------------------------------------------------------------------------
	//上传图片
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(
			function(response){
				if(response.success){
					$scope.image_entity.url= response.message;
				}else{
					alert(response.message);					
				}
			}		
		);
	}
 // ----------------------------------------------------------------------------------------
    $scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]}  };
	
	//将当前上传的图片实体存入图片列表
	$scope.add_image_entity=function(){
		//[   {color:红色，url:http://192.168.....}  , {color:红色，url:http://192.168.....}  ]
		//为什么要保存到goodsDesc.itemImages，是因为图片最终是要保存到tb_goods_desc
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);			
	}


/*	$scope.add_image_entity=function () {
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);

    }*/



// ----------------------------------------------------------------------------------------------
	//移除图片
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}

/*	$scope.remove_image_entity=function (index) {
		$scope.entity.goodsDesc.itemImages.splice(index,1);
    }*/



//------------------------------------------------------------------------------
	//查询一级商品分类列表
	$scope.selectItemCat1List=function(){
	
		itemCatService.findByparentId(0).success(
			function(response){
				$scope.itemCat1List=response;			
			}
		);
	}
// --------------------------------------------------------------------------------------
	//查询二级商品分类列表
	//$watch ： 监听变量的操作,参数1：监控的变量，参数2：
	// 变量变化的时候调用的方法  newValue：新值，oldValue：旧值
	$scope.$watch('entity.goods.category1Id',function(newValue,oldValue){
	alert(newValue);
		itemCatService.findByparentId(newValue).success(
				function(response){
					$scope.itemCat2List=response;			
				}
		);
	});
// ---------------------------------------------------------
	//查询三级商品分类列表
	$scope.$watch('entity.goods.category2Id',function(newValue,oldValue){
		
		itemCatService.findByparentId(newValue).success(
				function(response){
					$scope.itemCat3List=response;			
				}
		);
	});
	// ---------------------------------------------------------
	//读取模板ID   当我们监听三级分类的时候调用findOne方法将模板id查出来
	$scope.$watch('entity.goods.category3Id',function(newValue,oldValue){
		
		itemCatService.findOne(newValue).success(
			function(response){
				$scope.entity.goods.typeTemplateId =response.typeId;
			}
		);		
	});
// --------------------------------???????---------------------------------
	//读取模板ID后，读取品牌列表 扩展属性  规格列表
	$scope.$watch('entity.goods.typeTemplateId',function(newValue,oldValue){
		//读取品牌列表、规格属性
		typeTemplateService.findOne(newValue).success(
			function(response){
				//response —>tbtypetemplate实体类对象
				// 里边的包含的是 id，name spec-id  brandIds custom-attribute-id

				$scope.typeTemplate=response;// 模板对象
				//   [  {"id":1,"text":"联想"}  ]  =  " [{"id":1,"text":"联想"}] "
				//alert($scope.typeTemplate.brandIds)
				$scope.typeTemplate.brandIds= JSON.parse($scope.typeTemplate.brandIds);//品牌列表类型转换

                //[{"text":"内存大小"},{"text":"颜色"}]
                /*$scope.entity.goodsDesc.customAttributeItems=
				 JSON.parse($scope.typeTemplate.customAttributeItems);*/

				//扩展属性
				if( $location.search()['id']==null ){//如果是新增商品
					$scope.entity.goodsDesc.customAttributeItems=
						JSON.parse($scope.typeTemplate.customAttributeItems);
				}
			}
		);
		
		//当模版id改变的时候读取规格
		typeTemplateService.findSpecList(newValue).success(
			function(response){
				//[{"id":27,"text":"网络",options:[{},{}]}]
				//alert(response)
				$scope.specList=response;
			}
		);	
	});
	
	//勾选数据获取处理
	// $scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]}  };
	//参数1：$event，包含有html标签的事件执行操作，点击操作，勾选操作，取消勾选操作
	//参数2：name规格的名称 网络制式
	//参数3：value选项的值  移动5G
	$scope.updateSpecAttribute=function($event,name,value){
		
		//调用判断数据是否存在的方法
		//判断数据是否存在，存在追加数据，如果不存在添加数据
		var object= $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems ,'attributeName', name);
		//判断数据是否存在
		if(object!=null){	
			
			//数据存在
			//判断是否勾选，勾选添加数据
			//$event.target:获取操作的标签
			if($event.target.checked ){
				//[{"attributeName":"网络制式","attributeValue":["移动4G"]}]  -> [{"attributeName":"网络制式","attributeValue":["移动4G","移动3G"]}]
				object.attributeValue.push(value);		
			}else{
				// [{"attributeName":"网络制式","attributeValue":["移动4G","移动3G"]}] -> [{"attributeName":"网络制式","attributeValue":["移动4G"]}]
				//取消勾选，去除数据 从attributeValue中删除对应的数据
				//splice ： 删除数据  参数1：删除数据的位置，参数2：删除数据的个数
				//indexOf ：返回数据首次出现的位置
				object.attributeValue.splice( object.attributeValue.indexOf(value ) ,1);//移除选项
				//如果选项都取消了，将此条记录移除
				//[  {"attributeName":"网络制式","attributeValue":[]}  ] -> []
				if(object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
				
			}
		}else{	
			//数据不存在，往集合中添加数据
			//[]  -> [{"attributeName":"网络制式","attributeValue":["移动4G"]}]
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
	}
// --------------------------------------------------------------------------
	//创建SKU列表
	$scope.createItemList=function(){

		//sku的列表信息是通过规格去产生的
		//tbItem:{spec:{},price:0,num:99999,status:'0',isDefault:'0'}
		//在组合实体类中设置itemlist属性保存tbitem的数据
		//初始化SKU列表集合
		$scope.entity.itemList=[   {spec:{},price:0,num:99999,status:'0',isDefault:'0'}   ];//列表初始化

		//获取到规格信息集合
		var items= $scope.entity.goodsDesc.specificationItems;

		//遍历规格信息，开始生成新的SKU列表
		for(var i=0;i<items.length;i++){
			//生成新的sku列表
			$scope.entity.itemList= addColumn( $scope.entity.itemList, items[i].attributeName,items[i].attributeValue );			
		}	
	}
	
	//添加列，参数1：集合，参数2：规格的名称，参数3：规格的值
	addColumn=function(list,columnName,columnValues){
		var newList=[];
		for(var i=0;i< list.length;i++){
			var oldRow=  list[i];//获取itemList集合 的数据，以便进行深度克隆
			for(var j=0;j<columnValues.length;j++){
				var newRow=  JSON.parse( JSON.stringify(oldRow)  );//深克隆   //JSON.stringify将对象转化成字符串，JSON.parse再将字符串转化成对象
				newRow.spec[columnName]=columnValues[j];//设置新的列表中的规格数据
				newList.push(newRow);//设置新的列表中的价格、库存等数据
			}			
		}		
		return newList;//返回最新的规格列表，可以作为下一次生成的初始集合
	}
	
	//				 0		1		2		3
	$scope.status=['未审核','已审核','审核未通过','已关闭'];
	
	$scope.itemCatList=[];//商品分类列表
	//查询商品分类列表
	$scope.findItemCatList=function(){
		itemCatService.findAll().success(
			function(response){
				for(var i=0;i<response.length;i++){
					//itemCatList中元素的下标为id，因为商品列表是以商品的id来排序的，一级分类也是包含在商品信息中的，所以itemList的元素和商品信息保持一致
					$scope.itemCatList[response[i].id]=response[i].name; //$scope.itemCatList[865]=手机
				}
			}
		);
	}
	
	//判断规格与规格选项是否应该被勾选
	//参数1：网络制式  屏幕尺寸
	//参数2：移动4G
	$scope.checkAttributeValue=function(specName,optionName){
		//[  {"attributeName":"网络制式","attributeValue":["移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["5.5寸","4.5寸"]}  ]
		var items= $scope.entity.goodsDesc.specificationItems;

		//items：[{"attributeName":"网络制式","attributeValue":["移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["5.5寸","4.5寸"]}]
		//specName ： 网络制式
		var object =$scope.searchObjectByKey( items,'attributeName', specName);

		//object : {"attributeName":"网络制式","attributeValue":["移动4G","移动3G"]}
		//optionName ： 移动4G
		if(object!=null){
			if(object.attributeValue.indexOf(optionName)>=0){//如果能够查询到规格选项  indexOf:获取值在数组中位置，大于等于0表示数组中有值
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}		
	}
});	
