var talkingBrain = angular.module('talkingBrain', ['ui.router']),
    BASE_INFO = {},
    RES = "/Public/game/beta3/",
    wsAdd='ws://127.0.0.1:9090',
    socket=new WebSocket(wsAdd),
    SOCKET_BOX={
        _timeout:null,
        isopen:false,
        INIT:{},
        _do:function (){
            var end=true;
            if(SOCKET_BOX.INIT.start){
                SOCKET_BOX.INIT.count++;
                if(SOCKET_BOX.INIT.count>6){
                    console.log('可以开始了');
                    location.hash="#!/game";
                    // $('#loading_btn').removeClass('hide');
                    // $('#un_loading_btn').addClass('hide');
                    end = false;
                }
            }
            if(end){
              clearTimeout(SOCKET_BOX._timeout);
              SOCKET_BOX._timeout=setTimeout(function(){
                SOCKET_BOX._do();
              },1000);
            }
        }
    },
    so={
        send:function (message, callback){
            this.waitForConnection(function(){
                socket.send(message);  
                if (typeof callback !== 'undefined') {  
                    callback();  
                }
            },100);  
        },
        waitForConnection : function (callback, interval) {  
            if (socket.readyState === 1) {  
                callback();  
            } else {  
                var that = this;  
                setTimeout(function () {  
                    that.waitForConnection(callback, interval);  
                }, interval); 
            }
        }
    };
socket.binaryType = "arraybuffer";
socket.onerror =function(evt){
  alert('无法链接设备，请确定打开本地应用程序后刷新页面');
  socket=null;
}
socket.onclose=function(){
  socket = null;
  SOCKET_BOX.isopen  = false;
  SOCKET_BOX.INIT  = {};
  clearTimeout(SOCKET_BOX._timeout);
}
talkingBrain
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/list");
        $stateProvider.state('list', {
                url: "/list",
                templateUrl: RES + 'tpl/list.html',
                controller: "list"
            }).state('selection', {
                url: "/selection",
                templateUrl: RES + 'tpl/selection.html',
                controller: "selection"
            }).state('bring-device', {
                url: "/bring-device",
                templateUrl: RES + 'tpl/bring-device.html',
                controller: "bring-device"
            }).state('loading', {
                url: "/loading",
                templateUrl: RES + 'tpl/loading.html',
                controller: "loading"
            }).state('exit', {
                url: "/exit",
                templateUrl: RES + 'tpl/exit.html',
                controller: "exit"
            })
            .state('printing', {
                url: "/printing",
                templateUrl: RES + 'tpl/printing.html',
                controller: "printing"
            })
            .state('test-failed', {
                url: "/test-failed",
                templateUrl: RES + 'tpl/test-failed.html',
                controller: "test-failed"
            })
            .state('test-success', {
                url: "/test-success",
                templateUrl: RES + 'tpl/test-success.html',
                controller: "test-success"
            })
            .state('game', {
                url: "/game",
                templateUrl: RES + 'tpl/game.html',
                controller: "game"
            })
    })
    .directive('myheader', function() {
        return {
            restrict: 'E',
            template: '<header class="header"><div class="logo"><img src="' + RES + 'images/logo.png" alt=""></div><div class="home"><a href="#">HOME</a><span></span></div><div class="more"><a href="">Learn More</a></div></header>',
            replace: true
        };
    }).directive('myheader2', function() {
        return {
            restrict: 'E',
            template: '<header class="header listHead"><div class="logo"><img src="' + RES + 'images/logo-blue.png" alt=""></div><div class="home"><a href="#">HOME</a><span></span></div><div class="more"><a href="">Learn More</a></div></header>',
            replace: true
        };
    })
    .directive('loading', function() {
        return {
            restrict: 'E',
            template: '<div class="commonBg"><div class="circleBox"><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div></div><div class="ringBox"><div class="ring"></div><div class="ring"></div><div class="ring"></div></div></div>',
            replace: true
        };
    })
    .controller('list', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;
        $scope.play = function() {
            $location.path('selection');
        }
    }).controller('selection', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            // noSwiping : true,  //禁止滑动事件
            // noSwipingClass : 'stop-swiping',  //禁止滑动事件class
            paginationClickable: false //分页点击滑动
        });
        $scope.select_sex = function(x) {
            BASE_INFO.sex = x;
            swiper.slideNext();
        }
        $scope.select_name = function() {
            BASE_INFO.name = $scope.name;
            swiper.slideNext();
        }
        $scope.save = function() {
            BASE_INFO.age = parseInt($scope.age);
            if (BASE_INFO.age > 0 && BASE_INFO.age < 18) {
                $location.path('bring-device');
            } else {
                alert('请输入合法年龄')
            }
        }
    }).controller('bring-device', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;
        $scope.loading=function(){
          $location.path('loading');
        }

    }).controller('loading', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;

        if(socket){
          //websocket。开启监听
          socket.onopen=function(){
            SOCKET_BOX.isopen = true;
          }
          // socket.send(JSON.stringify({ command: 16, arg:""}));
          so.send(JSON.stringify({ command: 16, arg:""}));

          socket.onmessage=function(e){
            var o=eval("("+e.data+")");
            if(o.channel_state.join('')=="1111"){
              if(!SOCKET_BOX.INIT.start){
                SOCKET_BOX.INIT.start=true;
                SOCKET_BOX.INIT.count=0;
              }
            }else{
              SOCKET_BOX.INIT={}
            }
            clearTimeout(SOCKET_BOX._timeout);
            SOCKET_BOX._timeout=setTimeout(function(){
              SOCKET_BOX._do();
            },1000);
          }
        }

        $scope.game=function(){
          if(SOCKET_BOX.INIT.start){
            $location.path('game');
          }else{
            alert('设备未链接成功');
            $location.path('list');
          }
        }
    }).controller('printing', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;

    }).controller('test-failed', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;

    }).controller('test-success', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;

    }).controller('exit', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = '';
        $scope.RES = RES;

    }).controller('game', function($scope, $rootScope, $location) {
        $rootScope.bodyClass = 'game';
        $scope.RES = RES;

        document.getElementById('Stage1').addEventListener('touchstart', function(e) {
            if (e.srcElement.tagName == "A") {
                play.click(e.srcElement);
            }
        });
        document.getElementById('Stage1').addEventListener('click', function(e) {
            if (e.srcElement.tagName == "A") {
                play.click(e.srcElement);
            }
        });

        document.onkeydown = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                if (play.isready) {
                    play.init();
                } else if (play.isend) {
                    return false;
                } else {
                    play.click();
                }
            }
        }
        app.init();
        window.onresize = function() {
          app.init();
        }

    })

;