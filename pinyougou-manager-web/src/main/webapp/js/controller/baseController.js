app.controller('baseController' ,function($scope){


    //分页控件配置currentPage:当前页
    // totalItems :总记录数
    // itemsPerPage:每页记录数
    // perPageOptions :分页选项
    // onChange:当页码变更后自动触发的方法
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.reloadList();
        }
    };

    //刷新列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        /* $scope.findPage( $scope.paginationConf.currentPage ,  $scope.paginationConf.itemsPerPage );*/
    }

    $scope.seleteIds = [];//用户勾选的ID集合

    //用户勾选复选框
    // updateSelection
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked) {
            $scope.seleteIds.push(id);//push向集合添加元素
        } else {
            var index = $scope.seleteIds.indexOf(id);//查找值的 位置
            $scope.seleteIds.splice(index, 1);//参数1：移除的位置 参数2：移除的个数
        }
    };



//提取 json 字符串数据中某个属性，返回拼接字符串 逗号分隔
    $scope.jsonToString=function(jsonString,key){  //key就是你要显示的值
        var json=JSON.parse(jsonString);//将 json 字符串转换为 json 对象
        var value="";
        for(var i=0;i<json.length;i++){
            if(i>0){
                value+=","
            }
            value+=json[i][key];
        }
        return value;
    }





});