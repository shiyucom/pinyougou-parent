app.controller('searchController',function ($scope,searchService) { //searchServic注入进来
    //搜索 条件封装对象
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':''};
    $scope.search=function () {
        searchService.search($scope.searchMap).success(    //searchMap 在页面山进行绑定
            function (response) {
                 alert(response);
              $scope.resultMap=response;//搜索返回的结果
            }
        )
    }


    //添加搜索项
    $scope.addSearchItem=function(key,value) {
        if (key == 'category' || key == 'brand') {//如果点击的是分类或者是品牌
            $scope.searchMap[key] = value;
        } else { //否则是规格

                $scope.searchMap.spec[key] = value;
            }
            $scope.search();//执行搜索
        }


//移除复合搜索条件       页面164行调用
        $scope.removeSearchItem = function (key) {
            if (key == "category" || key == "brand") {//如果是分类或品牌
                $scope.searchMap[key] = "";
            } else {//否则是规格
                delete $scope.searchMap.spec[key];//移除此属性
            }
            $scope.search();//执行搜索
        }




});