app.controller('searchController', function ($scope,$location,searchService) { //searchServic注入进来
    //搜索 条件封装对象
    $scope.searchMap = {           /* 添加location服务用于接收参数*/
        'keywords': '',
        'category': '',
        'brand': '',
        'spec': {},
        'price': '',
        'pageNo': 1,
        'pageSize': 40,
        'sort':'',
        'sortField':''
    };
    //用户在首页的搜索框输入关键字，点击搜索后自动跳转到搜索页查询
    //加载查询字符串
    $scope.loadkeywords=function(){
        $scope.searchMap.keywords=  $location.search()['keywords'];  //??怎么回事？
        /*keywords 和 contentController.js里边的keywords一样*/
        $scope.search();
    }




/* —————————————————————————————————— */
    $scope.search = function () {
        //不管什么类型都要经过这一步     parseInt转化成 数字
        $scope.searchMap.pageNo = parseInt($scope.searchMap.pageNo);

        searchService.search($scope.searchMap).success(    //searchMap 在页面山进行绑定
            function (response) {
                alert(response);
                $scope.resultMap = response;//搜索返回的结果

                buildPageLabel();//在查询后调用此方法    调用分页的方法
            }
        )
    }

/*------------------------------------------------------------*/
    //添加搜索项
    $scope.addSearchItem = function (key, value) {
        if (key == 'category' || key == 'brand' || key == 'price') {//如果点击的是分类或者是品牌或价格
            $scope.searchMap[key] = value;
        } else { //否则是规格

            $scope.searchMap.spec[key] = value;
        }
        $scope.search();//执行搜索
    }

/*
-----------------------------------------------------------*/

    //移除复合搜索条件       页面164行调用
    $scope.removeSearchItem = function (key) {
        if (key == "category" || key == "brand" || key == 'price') {//如果是分类或品牌或者是价格
            $scope.searchMap[key] = "";
        } else {//否则是规格
            delete $scope.searchMap.spec[key];//移除此属性
        }
        $scope.search();//执行搜索
    }

/*
----------------------------------------------------------*/

    //构建分页标签(totalPages为总页数)
    buildPageLabel = function () {
        $scope.pageLabel = [];//新增分页栏属性
        var maxPageNo = $scope.resultMap.totalPages;//得到最后页码
        var firstPage = 1;//开始页码
        var lastPage = maxPageNo;//截止页码

        $scope.firstDot = true;//前面有点
        $scope.lastDot = true;//后边有点

        if ($scope.resultMap.totalPages > 5) {  //如果总页数大于5页,显示部分页码
            if ($scope.searchMap.pageNo <= 3) {//如果当前页小于等于3  显示前五页 1 2 3 4 5
                lastPage = 5; //前5页

                $scope.firstDot = false;//前面没点

            } else if ($scope.searchMap.pageNo >= lastPage - 2) {//如果当前页大于等于最大页码-2  (100 页 当前是99 页）
                firstPage = maxPageNo - 4;		 //后5页------？                    96 97      98 99 100

                $scope.lastDot = false;//后边没点

            } else { //显示当前页为中心的5页
                firstPage = $scope.searchMap.pageNo - 2;
                lastPage = $scope.searchMap.pageNo + 2;
            }

        } else {
            $scope.firstDot = false;//前面无点
            $scope.lastDot = false;//后边无点
        }

        //循环产生页码标签
        for (var i = firstPage; i <= lastPage; i++) {
            $scope.pageLabel.push(i);
        }
    }

/* -----------------------------------------------------------   */


    /*  修改页码执行查询*/

//根据页码查询
    $scope.queryByPage = function (pageNo) {
        //页码验证
        if (pageNo < 1 || pageNo > $scope.resultMap.totalPages) {
            return;
        }
        $scope.searchMap.pageNo = pageNo;
        $scope.search();  //查询
    }


    /*    ==============================================================   */

//判断当前页为第一页
    $scope.isTopPage=function(){
        if($scope.searchMap.pageNo==1){
            return true;
        }else{
            return false;
        }
    }
    //判断当前页是否未最后一页
    $scope.isEndPage=function(){
        if($scope.searchMap.pageNo==$scope.resultMap.totalPages){
            return true;
        }else{
            return false;
        }
    }

/*---------------------------------------------*/

//设置排序规则
    $scope.sortSearch=function(sortField,sort){
        $scope.searchMap.sortField=sortField;
        $scope.searchMap.sort=sort;
        $scope.search();  //  调用 查询
    }


/*---------------------------------------------------*/
  /*  需求；如果用户输入的是品牌的关键字，则隐藏品牌列表*/

//判断关键字是不是品牌 的子字符串
    $scope.keywordsIsBrand=function(){
        for(var i=0;i<$scope.resultMap.brandList.length;i++){
            //如果标题栏包含或者出现关键字  brandLIst是{'id';11,text;''}
            if($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text)>=0){
                //上面代表；$scope.resultMap.brandList[i].text 在 $scope.searchMap.keywords. 中的位置
                return true;
            }
        }
        return false;
    }



});