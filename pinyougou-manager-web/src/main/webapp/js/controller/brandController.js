//品牌控制
app.controller('brandController', function ($scope, $controller ,brandService) {
   $controller('baseController',{$scope:$scope});//继承
    //查询品牌列表
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }
    /*------------------------------------------------------------*/

    /*
    ------------------------------------------------------------------*/


    /*
    ---------------------------------------------------------------------*/

    //分页
    $scope.findPage = function (page, size) {
        brandService.findPage(page,size).success(
            function (response) {
                $scope.list = response.rows;//显示当前页数据
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //新增
    $scope.save = function () {
        var object = null;//方法名
        if ($scope.entity.id != null) {
            object=brandService.update($scope.entity);
        }else {
            object=brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if (response.success) {  //如果成功
                    $scope.reloadList();//刷新列表
                } else {
                    alert(response.message);  //指示错误
                }
            }
        );
    }
    /*
    --------------------------------------------------------------------------*/

    //查询实体
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }
    /*---------------------------------------------------------------/*/


    //删除
    $scope.dele = function () {
        if (confirm('确定要删除吗？')) {
            brandService.dele($scope.seleteIds).success(
                function (response) {
                    if (response.success) {  //如果成功了
                        $scope.reloadList();//刷新
                    } else {
                        alert(response.message);
                    }
                }
            );

        }
    }

    $scope.searchEntity = {};
    //条件查询
    $scope.search = function (page, size) {

        brandService.searc(page, size,$scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;//显示当前页数据
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );

    }
});
