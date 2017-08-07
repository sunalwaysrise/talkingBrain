<?php
namespace Index\Controller;
use Think\Controller;
class GameController extends Controller{
  // public function index(){
  //   $G=M('game');
  //   $d=$G->find(1);
  //   $this->assign('d',$d);
  //   $step1=explode(',', $d['step1_interfere']);
  //   $step2=explode(',', $d['step2_interfere']);
  //   $this->assign('step1',$step1);
  //   $this->assign('step2',$step2);
  //   $css=".correct{background:url(/Public/game_image/".$d['correct'].") no-repeat;background-position:50% 50%;background-size:auto 100%;}";
  //   foreach ($step1 as $k => $v) {
  //     $css.=".interfere".$k."{background:url(/Public/game_image/".$v.") no-repeat 50% 50%;background-size:auto 90%;}";
  //   }
  //   foreach ($step2 as $k => $v) {
  //     $css.=".interfere_".$k."{background:url(/Public/game_image/".$v.") no-repeat 50% 50%;background-size:auto 90%;}";
  //   }
  //   $css.=".correct_tip,.incorrect_tip{-webkit-animation: cutdownan-keyframes 300ms 1 ease both;width:80px;height:40px;position:absolute;top:0;font-size:40px;text-align:center;line-height:40px;font-style:normal}";
  //   $this->assign('css',$css);
  //   $this->display();
  // }
  // public function config(){
  //   $G=M('game');
  //   $d=$G->find(1);
  //   $this->ajaxReturn($d);
  // }
  public function config(){
    $G=M('game');
    $d=$G->find(1);
    $this->assign('d',$d);
    $this->display();
  }

  public function index(){
    $G=M('game');
    $d=$G->find(1);
    $this->assign('d',$d);
    $css=".correct{background:url(/Public/game_image/".$d['correct'].") no-repeat;background-position:50% 50%;background-size:auto 100%;}\n\n";
    $items=$d['content'];
    $items=json_decode($items,true);
    foreach ($items as $key => $value) {
      $interfere=explode(',',$value['interfere']);
      $i=0;
      foreach ($interfere as $v) {
        $css.=".interfere_".$key."_".$i."{background:url(/Public/game_image/".$v.") no-repeat 50% 50%;background-size:auto 90%;}\n";
        $i++;
      }
    }
    $css.=".correct_tip,.incorrect_tip{-webkit-animation: cutdownan-keyframes 300ms 1 ease both;width:80px;height:40px;position:absolute;top:0;font-size:40px;text-align:center;line-height:40px;font-style:normal}";
    $this->assign('css',$css);
    $this->display();
  }
  
  // public function save(){
  //   $data['id'] = 1;
  //   $data['step1_need_time'] = I('step1_need_time');
  //   $data['correct'] = I('correct');
  //   $data['step1_interfere'] = I('step1_interfere');
  //   $data['step1_interfere_odds'] = I('step1_interfere_odds');
  //   $data['step1_interval'] = I('step1_interval');
  //   $data['step1_interval_max'] = I('step1_interval_max');
  //   $data['step1_interval_min'] = I('step1_interval_min');
  //   $data['step1_delay'] = I('step1_delay');
  //   $data['step2_need_time'] = I('step2_need_time');
  //   $data['step2_interfere'] = I('step2_interfere');
  //   $data['step2_interfere_odds'] = I('step2_interfere_odds');
  //   $data['step2_interval'] = I('step2_interval');
  //   $data['step2_interval_max'] = I('step2_interval_max');
  //   $data['step2_interval_min'] = I('step2_interval_min');
  //   $data['step2_delay'] = I('step2_delay');
  //   $data['time'] = time();
  //   $tip=M('game')->save($data);
  //   if($tip){
  //     $r['flag']=1;
  //     $r['msg']='修改成功';
  //     $r['id']=$data['pid'];
  //   }else{
  //     $r['flag']=0;
  //     $r['msg']='修改失败';
  //   }
  //   $this->ajaxReturn($r);
  // }
  /**
  * 上传产品图片
  */ 
  public function upload_product_image(){
    $config = array(
      'maxSize'    =>    1000000,
      'rootPath'   =>    './Public/',
      'savePath'   =>    '/game_image/',
      'saveName'   =>    time().mt_rand(),
      'exts'       =>    array('jpg', 'gif', 'png', 'jpeg'),
      'autoSub'    =>    false,
    );
    $upload = new \Think\Upload($config);
    $info=$upload->upload();
    if($info){
      $url = $info['file']['savename'];
      $image = new \Think\Image();
      $image->open('./Public/game_image/'.$url);
      $image->thumb(500, 500,\Think\Image::IMAGE_THUMB_CENTER)->save('./Public/game_image/m'.$url);
      $r['msg']=$url;
      $r['flag']=1;
    }else{
      $r['flag']=0;
      $r['msg']='上传失败';
      $r['info']=$upload->getError();
    }
    $this->ajaxReturn($r);
  }
  public function upload_product_video(){
    $config = array(
      'maxSize'    =>    5120000,
      'rootPath'   =>    './Public/',
      'savePath'   =>    '/game_image/',
      'saveName'   =>    time().mt_rand(),
      'exts'       =>    array('jpg', 'gif', 'png', 'jpeg','mp3'),
      'autoSub'    =>    false,
    );
    $upload = new \Think\Upload($config);
    $info=$upload->upload();
    if($info){
      $url = $info['file']['savename'];
      $r['msg']=$url;
      $r['flag']=1;
    }else{
      $r['flag']=0;
      $r['msg']='上传失败';
      $r['info']=$upload->getError();
    }
    $this->ajaxReturn($r);
  }

  public function save2(){
    $data['id'] = 1;
    $data['correct'] = I('correct');
    $data['content'] = $_POST['content'];
    $data['time'] = time();
    $tip=M('game')->save($data);
    if($tip){
      $r['flag']=1;
      $r['msg']='修改成功';
    }else{
      $r['flag']=0;
      $r['msg']='修改失败';
    }
    $this->ajaxReturn($r);
  }
  public function savelog(){
    $s['sex']=I('sex');
    $s['age']=I('age');
    $s['name']=I('name');
    $s['log']=$_POST['log'];
    $s['counts']=$_POST['count'];
    $s['time']=time();
    $tip=M('game_log')->add($s);
  }
}