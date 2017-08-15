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
  try {
    app.init();
  } catch (e) {}
}

var correct_music = document.getElementById('correct_music'),
  incorrect_music = document.getElementById('incorrect_music');
var play = {
  click_times: 0,
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
  CUTDOWN_TIME: 3,
  init: function() {
    this.CUTDOWN_TIME = 3;
    this._init();
  },
  _init: function() {
    this.CUTDOWN_TIME--;
    var a = $("#cutdown-start");
    if (this.CUTDOWN_TIME >= 0) {
      a.html(this.CUTDOWN_TIME + 1).show().css({
        "margin-left": -a.width() / 2 + "px",
        "margin-top": -a.height() / 2 + "px",
        "font-size": a.height() * 0.7 + "px",
        "line-height": a.height() + "px"
      }).addClass("cutdownan-imation");
      setTimeout(function() {
        play._init();
      }, 1000);
    } else {
      a.removeClass("cutdownan-imation").hide().html('');
      this._init_(); //开始游戏
    }
  },
  _init_: function() {
    this.CUTDOWN_TIME = 3;
    if (SOCKET_BOX.INIT.start) {
      // socket.send(JSON.stringify({ command: 11, arg:""}));
      so.send(JSON.stringify({
        command: 11,
        arg: ""
      }));
      socket.onmessage = function(e) {
        var o = eval("(" + e.data + ")");
        console.log(o);
      }
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
      $('#count').show();
      this.next_step();

    } else {
      // console.log('设备未链接成功')
      // alert('设备未链接成功');
      location.reload();
      // location.hash='list';
    }

  },
  step_time_out_do: null,
  step_time_out: null,
  step_key: 0,
  next_step: function() {
    if (this.step_key <= Data.length) {
      if (play.step_key == 0) {
        //第一阶段不用倒计时
        this._next_step();
      } else {
        if (Data[this.step_key].type == "0") {
          //休息阶段不用倒计时
          this._next_step();
        } else {
          $('#rest_please').hide();
          //倒计时
          this.CUTDOWN_TIME--;
          var a = $("#cutdown-start");
          if (this.CUTDOWN_TIME >= 0) {
            a.html(this.CUTDOWN_TIME + 1).show().css({
              "margin-left": -a.width() / 2 + "px",
              "margin-top": -a.height() / 2 + "px",
              "font-size": a.height() * 0.7 + "px",
              "line-height": a.height() + "px"
            }).addClass("cutdownan-imation");
            setTimeout(function() {
              play.next_step(); //倒计时
            }, 1000);
          } else {
            a.removeClass("cutdownan-imation").hide().html('');
            this._next_step(); //开始游戏
          }
        }
      }
    } else {
      this.end();
    }
  },
  _next_step: function() {
    this.CUTDOWN_TIME = 3;
    if (play.step_key != 0) {
      //上一阶段结束
      so.send(JSON.stringify({
        command: 13,
        arg: "marker2"
      }));
    }
    if (this.step_key <= Data.length) {
      var step = play.step_key;
      console.log('当前第' + step + '步');
      clearTimeout(play.step_time_out_do);
      if (Data[step].type == "0") {
        //播放音乐
        //休息阶段
        $('#rest_please').removeClass('hide');
        this.paused = true;
        document.getElementById('rest_music_' + step).play();
      } else {
        $('#rest_please').addClass('hide');
        this.paused = false;
        play.step_time_out_do = setTimeout(function() {
          play.do();
        }, Data[step].delay * 1000);
      }

      //倒计时进入下一个阶段
      clearTimeout(play.step_time_out);
      play.step_time_out = setTimeout(function() {
        //进入下一阶段
        play.step_key++;
        if (play.step_key == Data.length) {
          play.end();
        } else {
          console.log('进入下一阶段:' + play.step_key)
          play.next_step();
        }
      }, Data[step].need_time * 60 * 1000);
      so.send(JSON.stringify({
        command: 13,
        arg: "marker1"
      }));
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
    if (this.isend || this.paused) {
      return false;
    }
    var pos = this.getRandomEmptyPosition(),
      o = {}; // 随机获得位置
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
    } else {
      o = {
        name: "correct",
        correct: true
      }; // 正确目标
      this.correctNumber++;
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
  },
  click: function() {
    play.click_times++;
    var result;
    // if (play.is_incorrect) {
    if (correct_music.paused) {
      correct_music.play();
    } else {
      correct_music.pause();
      correct_music.play();
    }
    // } else if (play.is_correct) {
    //   if (correct_music.paused) {
    //     correct_music.play();
    //   } else {
    //     correct_music.pause();
    //     correct_music.play();
    //   }
    // }

    $('#count').html(play.click_times);
    //计数器
    play.log.push({
      "type": "2",
      "time": new Date().getTime()
    }); //记录点击日志

    // socket.send(JSON.stringify({ command: 13, arg:"marker1"}));
    // so.send(JSON.stringify({ command: 13, arg:"marker1"}));
  },
  end: function() {
    // socket.send(JSON.stringify({ command: 12, arg:""}));
    so.send(JSON.stringify({
      command: 12,
      arg: ""
    })); // 全部结束
    this.isend = true;
    //游戏结束
    var log = JSON.stringify(this.log),
      params = {
        age: BASE_INFO.age,
        sex: BASE_INFO.sex,
        name: BASE_INFO.name,
        log: log,
        count: this.click_times
      };
    $.ajax({
      url: '/index/game/savelog',
      type: "post",
      data: params,
      success: function() {}
    });
    $('#count').hide();
    $("#Stage1 img").remove();
    document.getElementById('Stage2').style.display = "block";
    var h = [];
    h.push('<h2>点击<b>' + this.click_times + '</b>次</h2>')
    h.push('<h4>正确目标共出现<b>' + this.correctNumber + '</b>次</h4>');
    h.push('<h5>错误目标共出现<b>' + this.incorrectNumber + '</b>次</h5>');
    h.push('<a class="again" href="?_time=' + new Date().getTime() + '"></a>');
    document.getElementById('Stage2_1').innerHTML = h.join('');
    console.log(this.log);
  }
};