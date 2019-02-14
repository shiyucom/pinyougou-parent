//控制层
app.controller('itemCatController', function ($scope, $controller, itemCatService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        itemCatService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        itemCatService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        itemCatService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = itemCatService.update($scope.entity); //修改
        } else {
            serviceObject = itemCatService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.reloadList();//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        itemCatService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        itemCatService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //根据上级ID显示下级列表
    //
    $scope.findByparentId = function (parentId) {
        itemCatService.findByparentId(parentId).success(
            function (response) {
                $scope.list = response; //response将赋给   $scope。list-  前台根据list展示页面
            }
        )
    }

    $scope.grade = 1;//默认为1级
    //设置级别

    $scope.setGrade = function (value) {
        $scope.grade = value;
    }
    //读取列表   p_entity代表各级分类数据
    $scope.selectList=function (p_entity) {
        if($scope.grade==1){  //如果级别是 1级分类时候
            $scope.entity_1=null;  //这两个代表顶级分类
            $scope.entity_2=null;
        }
        if($scope.grade==2){ //如果级别是  2级分类时候

            $scope.entity_1=p_entity;   //grade==2 二级分类时 entity_1 代表一级类数据 entity_2=null
            $scope.entity_2=null;
        }

        if($scope.grade==3){ //如果级别是  3级别

            $scope.entity_2=p_entity; //grade==3二级分类时 entity_2 代表一级类数据

        }

        $scope.findByparentId(p_entity.id);	//查询此级下级列表
    }

});	
