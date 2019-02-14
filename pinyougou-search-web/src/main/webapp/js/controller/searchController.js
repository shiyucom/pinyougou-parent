app.controller('searchController',function ($scope,searchService) { //searchServic注入进来
    //搜索
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':''};
    $scope.search=function () {
        searchService.search($scope.searchMap).success(    //searchMap 在页面山进行绑定
            function (response) {
                 alert(response);
              $scope.resultMap=response;//搜索返回的结果
            }
        )
    }
});