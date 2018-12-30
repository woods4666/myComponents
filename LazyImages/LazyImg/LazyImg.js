/**
 * Created by Administrator on 2018/12/29 0029.
 */
import React from 'react';
class LazyImg extends React.Component {
  loaded = false;  //图片是否已经加载过了
  state = {
    imgSrc: ''  //图片的路径
  };
  loadImg = () => {
    let {offsetHeight, offsetTop} = this.refs.wrap,
      {scrollTop, clientHeight} = document.documentElement,
      {percentage} = this.props;
    if (scrollTop + clientHeight >= offsetHeight * percentage + offsetTop) { //页面卷去的高度加上一屏幕的高度，大于 盒子的高度乘以百分比加上盒子边框距离页面顶部的高度时
      this.setSrc();
      this.loaded = true;
    }
  };
  setSrc = () => {
    let {src} = this.props.itemData,
      tempImg = new Image();
    tempImg.onload = () => {
      this.setState({
        imgSrc: src
      });
      tempImg = null;
    };
    tempImg.src = src;
  };

  render() {
    let {itemData: {title}, defaultImg} = this.props,
      {imgSrc} = this.state;
    return (
      <div className="wrap" style={{height: 150, width: 750}} ref="wrap">
        <div className="imgBox" style={{
          display: 'inline-block',
          width: '30%',
          height: '100%',
          background: `url('${defaultImg}') no-repeat center`
        }}>
          <img src={imgSrc} id="${this.imgId}" style={{width: '100%', height: '100%'}}/>
        </div>
        <div className="title" style={{display: 'inline-block', width: '60%'}}>
          ${this.props.index}${title}
        </div>
      </div>
    );
  }
}
LazyImg.defaultProps = {
  itemData: {
    src: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3581792254,1787772481&fm=173&app=25&f=JPEG?w=218&h=146&s=DBACB7475B8662D2062E5B6D0300E068',
    title: '分析师观点｜中国股市需要华为精神'
  }
};
export default LazyImg;