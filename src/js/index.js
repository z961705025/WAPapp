/**
 * Created by admin on 2017/7/11.
 */


var app = angular.module('app',['ui.router']);

//创建控制器
    app.controller('AppController',['$scope','$window','$location',function ($scope,$window,$location) {

        $scope.titleAPP = "天天一刻";
        $scope.title = "首页";
        $scope.id = '0';
        // 接受广播
        $scope.$on('tab_notifice',function (e,regs) {


            var titleArray = ['首页','热门作者','栏目浏览','个人主页']
            $scope.id = regs.id;
            //发送广播
            $scope.$emit('home_notifice',{title:titleArray[regs.id]})

            //下面这句是因为同在一域内所以可以不用再次发送广播. 正常过程需要再次发送
            // $scope.title = titleArray[regs.id]
        })

        //返回功能

        $scope.back = function () {

            $window.history.back();

        }
        $scope.hidde = false;
        $scope.location = $location;
        $scope.$watch('location.url()',function (newD,oldD) {

           var newDD =newD.toString().slice(6)

            if (newDD == 'list'){
                $scope.hidde = false;
            }else {
                $scope.hidde = true;
            }
        })
    }])

//自定义指令navs

app.directive('navs',function () {
    return {
        restrict:"EA",
        replace:true,
        templateUrl:'../views/nav_tpl.html',
        controller:['$scope',function ($scope) {
            //接受广播
            $scope.$on('home_notifice',function (e,regs) {

                $scope.title = regs.title

            })
        }],
        link:function ($scope,ele,attr) {
            if (attr.isBack != 'true'){
                ele.find('span').css({
                    display:'none'
                })
            }

        }
    }


})


//自定义指令tab

app.directive('tab',function () {
    return {
        restrict:"EA",
        replace:true,
        templateUrl:'../views/tab_tpl.html',
        controller:'TabController',
        link:function ($scope,ele,regs) {
            $scope.$watch('id',function (newD,oldD) {
                //获取所有li
                var lis =ele.children()[0].children;
                for (var i =0 ;i<lis.length;i++){
                    lis[i].className =" "
                }
                lis[$scope.id].className="ava"

            })

        }
    }

})

//tab控制器

app.controller("TabController",['$scope',function ($scope) {

    $scope.tabChange = function (index) {
        console.log(index);
        //发送广播
        $scope.$emit('tab_notifice',{id:index});

    }

}])


//配置路由

app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $stateProvider.state('home',{
        url:'/home',
        views:{
            home: {
                templateUrl:'../views/home_tpl.html',
                controller:'HomeController'

            },
            author:{
                template:'<h1>作者</h1>'
            },
            content:{
                template:'<h2>content</h2>'
            },
            my:{
                template:'<h2>my</h2>'
            }
        }

    }).state('home.list',{
        url:'/list',
        templateUrl:'../views/list_tpl.html'

    }).state('home.detail',{
        url:'/detail/:id',
        template:'<details></details>',
        controller:'DetailController'
    });

    $urlRouterProvider.otherwise('home/list');

}])

//自定义指令
app.directive('details',function () {
    return {
        restrict:'EA',
        template:'<div class="home_detail"><div ui-view></div></div>',
        replace:true,
        link:function ($scope,ele,attr) {
            ele.html($scope.item.content);
        }
    }
})


//创建首页控制器
app.controller('HomeController',['$scope','$http',function ($scope,$http) {
    $scope.title = '我是一个人';
    $http({
        url:'http://127.0.0.1:8080/api/home.php',
        method:'jsonp',
    }).then(function (regs) {
        $scope.regsData = regs.data;
    }).catch(function (err) {
        console.log(err);
    })

}])

//详情控制器
app.controller('DetailController',['$scope','$stateParams',function ($scope,$stateParams) {
    var index = $stateParams.id;
    $scope.item  = $scope.regsData.posts[index]

}])

app.config(['$sceDelegateProvider',function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://127.0.0.1:8080/api/**'

    ])
    
}])