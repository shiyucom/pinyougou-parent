var app = angular.module('pinyougou', []);  //定义品优购模块
// 定义过滤器，获取不受信任的代码     trust;信任;信托
//$sce ： angularJS的信任操作
/*
app.filter('trustHtml',['$sce',function($sce){
    return function(data){//传入参数时被过滤的内容，不受信任的代码
        return $sce.trustAsHtml(data);//返回的是过滤信任后的内容（信任html的转换）
    }
} ]);*/
app.filter('trustHtml',['$sce',function ($sce) {
    return function (data) {
        return $sce.trustAsHtml(data);   //要在页面使用过滤器 找 serarch.html  349行
    }
}]);

