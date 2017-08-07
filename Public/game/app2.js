var app = {
  init: function() {
    var doc = document,
      body = doc.body,
      vendor = Hilo.browser.jsVendor;
    body.style[vendor + 'TouchCallout'] = 'none';
    body.style[vendor + 'UserSelect'] = 'none';
    body.style[vendor + 'TextSizeAdjust'] = 'none';
    body.style[vendor + 'TapHighlightColor'] = 'rgba(0,0,0,0)';
    this.initViewPort();
  },
  initViewPort: function() {
    var win = window,
      width,
      height,
      fontSize=30,
      winWidth = win.innerWidth,
      winHeight = win.innerHeight;
    width = height = Math.min(winWidth, winHeight); //设置游戏画布为正方形
    if(width<=320){fontSize=10;}
    else if(width<=375){fontSize=12;}
    else if(width<=415){fontSize=13;}
    else if(width<=768){fontSize=20;}
    else if(width<=1024){fontSize=25;}

    if(winWidth<winHeight){
      $('body,#outer').addClass('ver');
    }else{
      $('body,#outer').removeClass('ver');
    }
    var container = document.getElementById('container');
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.overflow = 'hidden';
    var Stage0 = document.getElementById('Stage0'),
      Stage1 = document.getElementById('Stage1');
    Stage1.style.width = width + 'px';
    Stage1.style.height = height + 'px';
    Stage0.style.width = width + 'px';
    Stage0.style.height = height + 'px';
    var Stage2 = document.getElementById('Stage2_1');
    Stage2.style.width = width + 'px';
    Stage2.style.height = height + 'px';
    Stage2.style.fontSize = fontSize + 'px';
    this.width = width;
    this.height = height;
  }
};

window.onresize = function() {
  app.init();
}

var correct_music = document.getElementById('correct_music'),
  incorrect_music = document.getElementById('incorrect_music');
var play = {
  flash:"/Public/game/beta2/_flash.gif",
  flash_error:"/Public/game/beta2/flash_error.gif",
  all_time: 10 * 60 * 1000,
  width: 6,
  height: 6,
  _data: [],
  play:true,
  isready:true,
  isend:false,
  ready:function(){
    $('#outer').addClass('init');
    document.getElementById('Stage0').style.display = "block";
    document.getElementById('Stage1').style.display = "none";
    document.getElementById('Stage2').style.display = "none";
    this.isready=true;
    this.isend=false;
  },
  init: function() {
    this.isready=false;
    this.isend=false;
    $('#outer').removeClass('init');
    this.log = [];
    this.correctNumber = 0;
    this.correctResult = 0;
    this.incorrectNumber = 0;
    this.incorrectResult = 0;
    var k = 0;
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        this._data.push({
          x: i,
          y: j,
          empty: true,
          index: k
        });
        k++;
      }
    }
    setTimeout(function() {
      play.step1.end = true;
      setTimeout(function(){
        play.step2.do();
      },play.step1.delay+play.step1.max_interval)
      setTimeout(function() {
        play.step2.end = true;
      }, play.step2.need_time); //阶段二结束
    }, play.step1.need_time); //第一阶段结束，进入第二阶段
    document.getElementById('Stage0').style.display = "none";
    document.getElementById('Stage1').style.display = "block";
    document.getElementById('Stage2').style.display = "none";
    this.step1.do();
  },
  getRandomEmptyPosition: function() { //随机获取一个空格位置
    var empty = [];
    for (var i = 0; i < this._data.length; i++) {
      if (this._data[i].empty) {
        empty.push(this._data[i]);
      };
    }
    var index = Math.floor(Math.random() * empty.length);
    var position = empty[index];
    return position;
  },
  key: 0,
  step1: {
    need_time: 0.5 * 60 * 1000,
    correct: "red",
    interfere: [
      "#9C27B0", "#03A9F4", "#00BCD4", "#009688"
    ], // 干扰元素
    interfere_odds: 50, //干扰项出现概率
    max_interval: 2000,
    min_interval: 1000,
    interval: function() {
      return Math.round((Math.random() * (this.max_interval - this.min_interval) + this.min_interval) * 10) / 10
    }, //出现元素的间隔时间
    delay: 1000, //停留时间
    end: false,
    do: function() {
      var pos = play.getRandomEmptyPosition(),
        o = {}; // 随机获得位置

      play.is_clicked = false;
      play.is_incorrect = false;
      play.is_correct = false;

      if (Math.random() < this.interfere_odds / 100) {
        o = {
          name: this.interfere[Math.floor(Math.random() * this.interfere.length)],
          correct: false
        }; // 随机取一个干扰项
        play.incorrectNumber++;
        play.is_incorrect = true;
      } else {
        o = {
          name: this.correct,
          correct: true
        }; // 正确目标
        play.correctNumber++;
        play.is_correct = true;
      }
      play.setPosition(o, pos);
      play.is_clicked = false;
      play.log.push({
        "type": "1",
        "pos": pos,
        "object": o,
        "time": new Date().getTime()
      }); // 记录出现日志
      play._data[pos.index].empty = false; //位置已经不为空
      setTimeout(function() {
        play.clearPosition(o, pos); // 倒计时删除
      }, this.delay);
      if (!play.step1.end) {
        setTimeout(function() {
          play.step1.do();
        }, play.step1.interval());
      }
    }
  },
  step2: {
    need_time: 0.5 * 60 * 1000,
    correct: "red",
    interfere: [
      "#9C27B0", "#03A9F4", "#00BCD4", "#009688"
    ], // 干扰元素
    interfere_odds: 50, // 干扰项出现概率,基数100
    max_interval: 2000,
    min_interval: 1000,
    interval: function() {
      return Math.round((Math.random() * (this.max_interval - this.min_interval) + this.min_interval) * 10) / 10
    }, //出现元素的间隔时间
    delay: 1000, // 停留时间
    end: false,
    do: function() {
      var pos = play.getRandomEmptyPosition(),
        o = {}; // 随机获得位置

      play.is_clicked = false;
      play.is_incorrect = false;
      play.is_correct = false;

      if (Math.random() < this.interfere_odds / 100) {
        o = {
          name: this.interfere[Math.floor(Math.random() * this.interfere.length)],
          correct: false
        }; // 随机取一个干扰项
        play.incorrectNumber++;
        play.is_incorrect = true;
      } else {
        o = {
          name: this.correct,
          correct: true
        }; // 正确目标
        play.correctNumber++;
        play.is_correct = true;
      }
      play.setPosition(o, pos);

      play.log.push({
        "type": "1",
        "pos": pos,
        "object": o,
        "time": new Date().getTime()
      }); // 记录出现日志
      play._data[pos.index].empty = false; //位置已经不为空
      setTimeout(function() {
        play.clearPosition(o, pos); // 倒计时删除
      }, this.delay);

      if (!play.step2.end) {
        setTimeout(function() {
          play.step2.do();
        }, play.step2.interval());
      } else {
        play.end();
      }
    }
  },
  setPosition: function(o, pos) { //放到相应位置
    var x = pos.x,
      y = pos.y;
    var per = app.width / play.width;
    this.pos=pos;
    var h = '<a class="item correct_' + o.correct + ' ' + o.name + '" data_correct="' + o.correct + '" data_clicked="false" id="correct_' + o.correct + '" style="width:' + per + 'px;height:' + per + 'px;left:' + (x * per) + 'px;top:' + (y * per) + 'px;"></a>';
    $("#Stage1").append(h);

  },
  clearPosition: function(o, pos) {
    $('#correct_' + o.correct).hide().remove(); //删除元素
    play._data[pos.index].empty = true; //腾出位置
    play.is_incorrect = false; //清除当前状态
    play.is_correct = false; //清除当前状态
    play.is_clicked = false;
  },
  click: function() {
    if (play.is_clicked) {

    } else {
      var result;
      if (play.is_incorrect) {

        play.incorrectResult++;

        if (incorrect_music.paused) {
          incorrect_music.play();
        } else {
          incorrect_music.pause();
          incorrect_music.play();
        }

        play.is_clicked = true;

        //点击了错误的内容
        result = false;
        // 播放动画

        var per = (app.width / play.width),
          left=(this.pos.x*per),
          top=(this.pos.y*per);
        var flash='<img class="incorrect_flash" src="'+this.flash_error+'?v='+play.incorrectResult+'" style="width:'+per+'px;height:'+per+'px;left:'+left+'px;top:'+top+'px" id="in_correct_'+play.incorrectResult+'" />';
        $('#Stage1').append(flash);
        setTimeout(function(){
          $('#in_correct_'+play.incorrectResult).remove();
        },800);
        

      } else if (play.is_correct) {

        play.correctResult++;

        if (correct_music.paused) {
          correct_music.play();
        } else {
          correct_music.pause();
          correct_music.play();
        }

        play.is_clicked = true;

        //点击了正确的内容
        result = true;
        // 播放动画

        var per = (app.width / play.width),
          left=(this.pos.x*per)-40,
          top=(this.pos.y*per)-70;
        per+=80;
        var flash='<img class="correct_flash" src="'+this.flash+'?v='+play.correctResult+'" style="width:'+per+'px;height:'+per+'px;left:'+left+'px;top:'+top+'px" id="correct_'+play.correctResult+'" />';
        $('#Stage1').append(flash);
        setTimeout(function(){
          $('#correct_'+play.correctResult).remove();
        },1200);
      } else {
        result = 'empty';
        //当前视图没有内容
      }
      play.log.push({
        "type": "2",
        "result": result,
        "time": new Date().getTime()
      }); //记录点击日志
    }
  },
  end: function() {
    this.isend=true;
    //游戏结束
    document.getElementById('Stage2').style.display = "block";
    var h = [];
    h.push('<h2>点击<b>' + this.correctResult + '</b>正确</h2>')
    h.push('<h3>点击<b>' + this.incorrectResult + '</b>错误</h3>')
    h.push('<h4>正确目标共出现<b>' + this.correctNumber + '</b>次</h4>');
    h.push('<h5>错误目标共出现<b>' + this.incorrectNumber + '</b>次</h5>');
    h.push('<a class="again animated infinite pulse" onclick="location.reload();"></a>');
    document.getElementById('Stage2_1').innerHTML = h.join('');
    console.log(this.log);
  }
};

document.getElementById('Stage1').addEventListener('touchstart', function(e) {
  if (e.srcElement.tagName == "A") {
    play.click(e.srcElement);
  }
});

// document.getElementById('Stage1').addEventListener('click', function(e) {
//   if (e.srcElement.tagName == "A") {
//     play.click(e.srcElement);
//   }
// });

document.onkeydown = function(event) {
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode == 32) {
    if(play.isready){
      play.init();
    }else if(play.isend){
      return false;      
    }else{
      play.click();
    }
  }
}