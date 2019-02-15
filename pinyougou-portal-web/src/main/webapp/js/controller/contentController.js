//广告控制层（运营商后台）
app.controller("contentController",function($scope,contentService){
    $scope.contentList=[];//广告集合
    $scope.findByCategoryId=function(categoryId){
        contentService.findByCategoryId(categoryId).success(
            function(response){
                $scope.contentList[categoryId]=response;
            }
        );
    }


   //x需求； 用户在首页的搜索框输入关键字，点击搜索后自动跳转到搜索页查询
    //搜索跳转
    $scope.search=function () {
        location.href="http://localhost:9104/search.html#?keywords="+$scope.keywords;
    }

});