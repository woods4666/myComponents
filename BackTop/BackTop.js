/**
 * Created by Administrator on 2019/1/1 0001.
 * @description：回到顶部
 */
import React from 'react';
import './BackTop.less';
import {Icon} from 'antd';

class BackTop extends React.Component {
  constructor(){
    super();
    this.state = {
      overScreenHeight: false //滚动高度达到此参数值才出现BackTop
    };
  }

  render(){
    let {icon} = this.props,
      {overScreenHeight} = this.state;
    return [
        overScreenHeight && <div className="BackTop" key="BackTop" onClick={this.backTop}>
          {icon}
        </div>
      ];
  }

  componentDidMount() {
    this.bindScrollEventToTarget();
  }

  bindScrollEventToTarget = () => {
    let {target} = this.props;
    target.addEventListener('scroll', this.targetScroll, false);
  };
  targetScroll = e => {
    let {scrollTopTarget, visibilityHeight} = this.props,
     {scrollTop} = scrollTopTarget;
    if (scrollTop > visibilityHeight) {
      this.showBackTop();
    } else {
      this.hideBackTop();
    }
  };

  //显示BackTop
  showBackTop = () => {
    this.setState({
      overScreenHeight: true
    });
  };

  //隐藏BackTop
  hideBackTop = () => {
    this.setState({
      overScreenHeight: false
    });
  };


  //回到顶部
  backTop = e => {
    let {isLinear} = this.props;
    if (isLinear) {
      this.linearBackToTop();
    } else {
      this.fromFastToSlowBackToTop();
    }
  };

  //匀速
  linearBackToTop = () => {
    let {duration, timeOut, scrollTopTarget, afterBackTopFn} = this.props,
      {scrollTop} = scrollTopTarget,
      speed = scrollTop / duration * timeOut; //滚动的速度
    let timer = setInterval(() => {
      scrollTop = scrollTop - speed;
      if (scrollTop <= 0) {
        scrollTopTarget.scrollTop = 0;
        clearInterval(timer); //结束滚动
        afterBackTopFn && afterBackTopFn();
      } else {
        scrollTopTarget.scrollTop = scrollTop;
      }
    }, timeOut);
  };

  //先快后慢
  fromFastToSlowBackToTop = () => {
    let {duration, timeOut, scrollTopTarget, afterBackTopFn} = this.props,
      {scrollTop} = scrollTopTarget,
      minScrollTop = 1, //当卷去高度小于这个数字时候，结束滚动
      baseNumber = Math.pow(minScrollTop / scrollTop, timeOut / duration);  //底数（大于0小于1），scrollTop不断乘以这个底数，使得滚动速度由快到慢
    let timer = setInterval(() => {
      scrollTop = scrollTop * baseNumber;
      if (scrollTop <= minScrollTop) {
        scrollTopTarget.scrollTop = 0;
        clearInterval(timer); //结束滚动
        afterBackTopFn && afterBackTopFn();
      } else {
        scrollTopTarget.scrollTop = scrollTop;
      }
    }, timeOut);
  }
}

BackTop.defaultProps={
  icon: <Icon type="to-top"/>,  // 回到顶部小图标
  target: window,  //绑定鼠标滑动事件的对象
  scrollTopTarget: document.documentElement, //监听该对象的卷去高度
  visibilityHeight: document.documentElement.clientHeight, //滚动高度达到此参数值才出现BackTop
  isLinear: false, //true:匀速回到顶部 false:先快后慢
  duration: 3000,  //回到顶部所用时间
  timeOut: 17,  //每隔多少毫秒重新设置一次scrollTop
  afterBackTopFn: () => {console.log('到达顶部啦!!');}, //回到顶部后执行的回调函数
};

export default BackTop;