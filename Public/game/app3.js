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
      winWidth = win.innerWidth,
      winHeight = win.innerHeight;
    width = height = Math.min(winWidth, winHeight); //设置游戏画布为正方形
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
  flash: "/Public/game/beta2/_flash.gif",
  flash_error: "/Public/game/beta2/flash_error.gif",
  width: 6,
  height: 6,
  _data: [],
  play: true,
  isready: true,
  isend: false,
  ready: function() {
    $('#outer').addClass('init');
    document.getElementById('Stage0').style.display = "block";
    document.getElementById('Stage1').style.display = "none";
    document.getElementById('Stage2').style.display = "none";
    this.isready = true;
    this.isend = false;
  },
  init: function() {
    this.isready = false;
    this.isend = false;
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

    document.getElementById('Stage0').style.display = "none";
    document.getElementById('Stage1').style.display = "block";
    document.getElementById('Stage2').style.display = "none";

    this.next_step();
  },
  step_time_out_do: null,
  step_time_out: null,
  step_key: 0,
  next_step: function() {
    if (this.step_key <= Data.length) {
      var step = play.step_key;
      console.log('当前第' + step + '步');
      clearTimeout(play.step_time_out_do);
      if (this.step_key == 0) {
        play.step_time_out_do = setTimeout(function() {
          play.do();
        }, Data[step].delay * 1000);
      } else {
        // play.step_time_out_do = setTimeout(function() {
        //   play.do();
        // }, Data[step - 1].delay * 1000 + Data[step].delay * 1000 + Data[step - 1].max_interval * 1000);

        play.step_time_out_do = setTimeout(function() {
          play.do();
        }, Data[step].delay * 1000);

      }
      var t1;
      if (this.step_key == 0) {
        // t1 = Data[step].need_time * 60 * 1000 + Data[step].delay * 1000;
        t1 = Data[step].need_time * 60 * 1000;
      } else {
        // t1 = Data[step].need_time * 60 * 1000 + Data[step].delay * 1000 + Data[step - 1].max_interval * 1000;
        t1 = Data[step].need_time * 60 * 1000;
      }
      clearTimeout(play.step_time_out);
      console.log(t1);
      play.step_time_out = setTimeout(function() {
        //进入下一阶段
        play.step_key++;
        if (play.step_key == Data.length) {
          play.end();
        } else {
          console.log('进入下一阶段:' + play.step_key)
          play.next_step();
        }
      }, t1);
    } else {
      //游戏结束
      this.end();
    }
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
  interval: function() {
    var max_interval = Data[this.step_key].max_interval * 1000,
      min_interval = Data[this.step_key].min_interval * 1000;
    return min_interval + Math.round(Math.random() * (max_interval - min_interval));
  },
  time_out: null,
  do: function() {
    if (this.isend) {
      return false;
    }
    if (play.is_incorrect || play.is_correct) {
      // 如果界面存在元素
      clearTimeout(play.time_out);
      play.time_out = setTimeout(function() {
        play.do();
      }, this.interval());
    } else {
      var pos = this.getRandomEmptyPosition(),
        o = {}; // 随机获得位置
      this.is_clicked = false;
      this.is_incorrect = false;
      this.is_correct = false;
      if (this.step_key > Data.length) {
        this.step_key = Data.length;
      }
      var D = Data[this.step_key],
        odds = D.odds,
        interfere = D.interfere.split(','),
        delay = D.delay * 1000;
      if (Math.random() < D.odds / 100) {
        o = {
          name: "interfere_" + this.step_key + "_" + Math.floor(Math.random() * interfere.length),
          correct: false
        }; // 随机取一个干扰项
        this.incorrectNumber++;
        this.is_incorrect = true;
      } else {
        o = {
          name: "correct",
          correct: true
        }; // 正确目标
        this.correctNumber++;
        this.is_correct = true;
      }
      this.setPosition(o, pos);
      this.log.push({
        "type": "1",
        "pos": pos,
        "object": o,
        "time": new Date().getTime()
      }); // 记录出现日志
      this._data[pos.index].empty = false; //位置已经不为空
      setTimeout(function() {
        play.clearPosition(o, pos); // 倒计时删除
      }, delay);
      clearTimeout(play.time_out);
      play.time_out = setTimeout(function() {
        play.do();
      }, this.interval());
    }
  },
  setPosition: function(o, pos) { //放到相应位置
    var x = pos.x,
      y = pos.y;
    var per = app.width / play.width;
    this.pos = pos;
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
          left = (this.pos.x * per),
          top = (this.pos.y * per);
        var flash = '<img class="incorrect_flash" src="' + this.flash_error + '" style="width:' + per + 'px;height:' + per + 'px;left:' + left + 'px;top:' + top + 'px" id="in_correct_' + play.incorrectResult + '" />';
        // var flash = '<img class="incorrect_flash" src="' + this.flash_error + '?v=' + play.incorrectResult + '" style="width:' + per + 'px;height:' + per + 'px;left:' + left + 'px;top:' + top + 'px" id="in_correct_' + play.incorrectResult + '" />';
        // var flash = '<div class="incorrect_flash" style="width:' + per + 'px;height:' + per + 'px;left:' + left + 'px;top:' + top + 'px" id="in_correct_' + play.incorrectResult + '" ></div>';


        $("#Stage1 img").remove();
        $('#Stage1').append(flash);
        setTimeout(function() {
          $('#in_correct_' + play.incorrectResult).remove();
        }, 800);


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
          left = (this.pos.x * per) - 40,
          top = (this.pos.y * per) - 70;
        per += 80;
        var flash = '<img class="correct_flash" src="' + this.flash + '" style="width:' + per + 'px;height:' + per + 'px;left:' + left + 'px;top:' + top + 'px" id="correct_' + play.correctResult + '" />';
        // var flash = '<img class="correct_flash" src="' + this.flash + '?v=' + play.correctResult + '" style="width:' + per + 'px;height:' + per + 'px;left:' + left + 'px;top:' + top + 'px" id="correct_' + play.correctResult + '" />';

        $("#Stage1 img").remove();
        $('#Stage1').append(flash);
        setTimeout(function() {
          $('#correct_' + play.correctResult).remove();
        }, 1200);
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
    this.isend = true;
    //游戏结束
    $("#Stage1 img").remove();
    document.getElementById('Stage2').style.display = "block";
    var h = [];
    h.push('<h2>点击<b>' + this.correctResult + '</b>正确</h2>')
    h.push('<h3>点击<b>' + this.incorrectResult + '</b>错误</h3>')
    h.push('<h4>正确目标共出现<b>' + this.correctNumber + '</b>次</h4>');
    h.push('<h5>错误目标共出现<b>' + this.incorrectNumber + '</b>次</h5>');
    h.push('<a class="again" href="#"></a>');
    document.getElementById('Stage2_1').innerHTML = h.join('');
    console.log(this.log);
  }
};