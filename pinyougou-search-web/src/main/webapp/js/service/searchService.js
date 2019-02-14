//搜索服务层
app.service("searchService",function ($http) {

    this.search=function (searchMap) { // searchMap 后端传的数据
        return $http.post('itemsearch/search.do',searchMap);  //根据controllerler.java 里边的地址寻找
    }
});
