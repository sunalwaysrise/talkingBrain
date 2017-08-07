var app={
  init:function() {
    var doc=document,body=doc.body,vendor=Hilo.browser.jsVendor;
    body.style[vendor + 'TouchCallout'] = 'none';
    body.style[vendor + 'UserSelect'] = 'none';
    body.style[vendor + 'TextSizeAdjust'] = 'none';
    body.style[vendor + 'TapHighlightColor'] = 'rgba(0,0,0,0)';
    this.initViewPort();
  },
  initViewPort:function(){
    var win=window,
      width,
      height,
      winWidth=win.innerWidth,
      winHeight=win.innerHeight;
    width=height=Math.min(winWidth,winHeight);//设置游戏画布为正方形
    var container = document.getElementById('container');
    container.style.width=width+'px';
    container.style.height=height+'px';
    container.style.overflow = 'hidden';
    var Stage0=document.getElementById('Stage0'),
      Stage1=document.getElementById('Stage1'),
      Stage2=document.getElementById('Stage2');
    Stage1.style.width=width+'px';
    Stage1.style.height=height+'px';
    Stage2.style.width=width+'px';
    Stage2.style.height=height+'px';
    Stage0.style.width=width+'px';
    Stage0.style.height=height+'px';
    this.width=width;
    this.height=height;
  }
};

window.onresize=function(){
  app.init();
}

var correct_music=document.getElementById('correct_music');
var play={
  all_time:10*60*1000,
  width:6,
  height:6,
  _data:[],
  init:function(){
    this.log=[];
    this.correctNumber=0;
    this.correctResult=0;
    this.incorrectNumber=0;
    this.incorrectResult=0;
    var k=0;
    for(var i = 0; i < this.width; i++){
      for(var j = 0; j < this.height; j++){
        this._data.push({x:i, y:j,empty:true,index:k});
        k++;
      }
    }
    setTimeout(function(){
      play.step1.end=true;
      play.step2.do();
      setTimeout(function(){
        play.step2.end=true;
      },play.step2.need_time);//阶段二结束
    },play.step1.need_time);//第一阶段结束，进入第二阶段
    document.getElementById('Stage0').style.display="none";
    document.getElementById('Stage1').style.display="block";
    document.getElementById('Stage2').style.display="none";
    this.step1.do();
  },
  getRandomEmptyPosition: function(){//随机获取一个空格位置
    var empty = [];
    for(var i = 0; i < this._data.length; i++){
      if( this._data[i].empty ) {
        empty.push(this._data[i]);
      };
    }
    var index = Math.floor(Math.random()*empty.length);
    var position = empty[index];
    return position;
  },
  key:0,
  step1:{
    need_time:0.5*60*1000,
    correct:"red",
    interfere:[
      "#9C27B0","#03A9F4","#00BCD4","#009688"
    ],// 干扰元素
    interfere_odds:50,//干扰项出现概率
    interval:1000,//出现元素的间隔时间
    delay:1000,//停留时间
    end:false,
    do:function(){
      var pos=play.getRandomEmptyPosition(),o={};// 随机获得位置
      if(Math.random()<this.interfere_odds/100){
        o={name:this.interfere[Math.floor(Math.random()*this.interfere.length)],correct:false};// 随机取一个干扰项
        play.incorrectNumber++;
      }else{
        o={name:this.correct,correct:true};// 正确目标
        play.correctNumber++;
      }
      o.id="O_"+play.key;
      play.key++;
      play.setPosition(o,pos);
      play.log.push({"type":"1","pos":pos,"object":o,"time":new Date().getTime()});// 记录出现日志
      play._data[pos.index].empty=false;//位置已经不为空
      setTimeout(function(){
        play.clearPosition(o,pos);// 倒计时删除
      },this.delay);
      if(!play.step1.end){
        setTimeout(function(){
          play.step1.do();
        },play.step1.interval);
      }
    }
  },
  step2:{
    need_time:0.5*60*1000,
    correct:"red",
    interfere:[
      "#9C27B0","#03A9F4","#00BCD4","#009688"
    ],// 干扰元素
    interfere_odds:50,// 干扰项出现概率,基数100
    interval:300,// 出现元素的间隔时间
    delay:1000,// 停留时间
    end:false,
    do:function(){
      var pos=play.getRandomEmptyPosition(),o={};// 随机获得位置
      if(Math.random()<this.interfere_odds/100){
        o={name:this.interfere[Math.floor(Math.random()*this.interfere.length)],correct:false};// 随机取一个干扰项
        play.incorrectNumber++;
      }else{
        o={name:this.correct,correct:true};// 正确目标
        play.correctNumber++;
      }
      o.id="O_"+play.key;
      play.key++;
      play.setPosition(o,pos);
      play.log.push({"type":"1","pos":pos,"object":o,"time":new Date().getTime()});// 记录出现日志
      play._data[pos.index].empty=false;//位置已经不为空
      setTimeout(function(){
        play.clearPosition(o,pos);// 倒计时删除
      },this.delay);

      if(!play.step2.end){
        setTimeout(function(){
          play.step2.do();
        },play.step2.interval);
      }else{
        play.end();
      }
    }
  },
  setPosition:function(o,pos){//放到相应位置
    var x=pos.x,
      y=pos.y;
    var per=app.width/play.width;
    var h='<a class="item correct_'+o.correct+' '+o.name+'" data_correct="'+o.correct+'" data_clicked="false" id="'+o.id+'" style="width:'+per+'px;height:'+per+'px;left:'+(x*per)+'px;top:'+(y*per)+'px;"></a>';
    $("#Stage1").append(h);
    document.getElementById(o.id).style.opacity=".9";
  },
  clearPosition:function(o,pos){
      $('#'+o.id).hide().remove();//删除元素
      play._data[pos.index].empty=true;//腾出位置
  },
  click:function(e){
    var a=$(e);
    if(a.attr('data_clicked')=="false"){
      a.addClass('clicked').attr({'data_clicked':"true"});
      result=a.attr('data_correct');
      play.log.push({"type":"2","result":result,"time":new Date().getTime()});//记录点击日志
      if(result=="true"){
        play.correctResult++;
        if(correct_music.paused){
          correct_music.play();
        }else{
          correct_music.pause();
          correct_music.play();
        }
        $('body').append('<i class="correct_tip">+1</i>');
      }else{
        play.incorrectResult++;
        if(incorrect_music.paused){
          incorrect_music.play();
        }else{
          incorrect_music.pause();
          incorrect_music.play();
        }
        $('body').append('<i class="incorrect_tip">-1</i>');
      }
      // a.hide();
    }else{
      a.hide();
    }
  },
  end:function(){
    //游戏结束
    document.getElementById('Stage0').style.display="none";
    document.getElementById('Stage1').style.display="none";
    document.getElementById('Stage2').style.display="block";
    var h=[];
    h.push('<div><h2>游戏结束</h2><p>正确目标一共出现了<b>'+this.correctNumber+'</b>次</p>')
    h.push('<p>错误目标共出现了<b>'+this.incorrectNumber+'</b>次</p>')
    h.push('<p>您点击了正确目标<b>'+this.correctResult+'</b>次</p>');
    h.push('<p>您点击了错误目标<b>'+this.incorrectResult+'</b>次</p><span>游戏完整日志请看控制台</span>');
    h.push('<a class="btn" onclick="location.reload();">再玩一次</a></div>');
    document.getElementById('Stage2').innerHTML=h.join('');
    console.log(this.log);
  }
};

document.getElementById('Stage1').addEventListener('touchstart',function(e){
  if(e.srcElement.tagName=="A"){
    play.click(e.srcElement);
  }
});
document.getElementById('Stage1').addEventListener('click',function(e){
  if(e.srcElement.tagName=="A"){
    play.click(e.srcElement);
  }
});



