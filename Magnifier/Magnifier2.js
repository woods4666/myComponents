/**
 * Created by Administrator on 2018/12/30 0030.
 * @description:放大镜
 */
import React from 'react';
import './Magnifier2.less';
import {Button} from 'antd';

class Magnifier extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 'width',//图片那条边比较长
      imgIndex: 0,//当前图片在imgList中的索引
      isEnterImgBox: false,//鼠标是否进入图片
      markPosition: {//mark定位
        left: 0,
        top: 0
      }
    };
  }

  // 切换图片
  handleSwitch = () => {
    let {imgList} = this.props;
    this.setState(preState => ({
      imgIndex: preState.imgIndex >= imgList.length - 1 ? 0 : preState.imgIndex + 1
    }));
  };

  // 调整大图片和小图片的尺寸
  adjustImgSize = () => {
    let {offsetWidth, offsetHeight} = this.smallImg;
    this.setState({
      max: offsetWidth >= offsetHeight ? 'width' : 'height'
    });
  };

  // 鼠标进入图片时
  enterSmallBox = e => {
    this.setState({
      isEnterImgBox: true
    });
  };

  // 鼠标离开图片时
  leaveSmallBox = e => {
    this.setState({
      isEnterImgBox: false
    });
  };

  //鼠标在图片中移动
  moveInSmallBox = e => {
    this.setMarkPosition(e);
  };
  //改变mark的定位
  setMarkPosition = e => {
    let {pageX, pageY} = e,
      {offsetWidth: smallImgW, offsetHeight: smallImgH} = this.smallImg,
      {offsetWidth: markW, offsetHeight: markH} = this.markNode;
    let offsetLeft = this.computedOffset(this.smallImg, 'offsetLeft'),
      offsetTop = this.computedOffset(this.smallImg, 'offsetTop');
    let left = pageX - offsetLeft - markW / 2,
      maxLeft = smallImgW - markW,
      top = pageY - offsetTop - markH / 2,
      maxTop = smallImgH - markH;
    left = left > maxLeft ? maxLeft : (left < 0 ? 0 : left);
    top = top > maxTop ? maxTop : (top < 0 ? 0 : top);
    this.setState({
      markPosition: {
        left,
        top
      }
    });
  };
  //计算图片的偏移量（offsetLeft/offsetTop）
  computedOffset = (node, offsetName) => {
    let offset = 0,
      parent = node.offsetParent;
    while (parent) {
      offset = offset + node[offsetName];
      node = parent;
      parent = node.offsetParent;
    }
    return offset;
  };

  render() {
    //计算样式用到的变量
    let {proportion, proportionSmallBox, magnifierWidth, isCircle, markOpacity, imgList} = this.props,
      {isEnterImgBox, markPosition, imgIndex, max} = this.state,
      {smallImgSrc, bigImgSrc} = imgList[imgIndex],
      display = isEnterImgBox ? 'block' : 'none',
      opacity = isEnterImgBox ? markOpacity : 0,
      radiusStyle = isCircle ? {borderRadius: '50%'} : {};

    //smallBox样式
    let smallBoxWidth = proportionSmallBox * magnifierWidth,
      smallBoxStyle = {width: smallBoxWidth, height: smallBoxWidth};

    //mark样式
    let markWidth = proportion * smallBoxWidth,
      markStyle = {
        width: markWidth,
        height: markWidth,
        opacity,
        left: markPosition.left,
        top: markPosition.top,
        ...radiusStyle
      };

    //smallImg样式
    let smallImgStyle = {
      [max]: smallBoxWidth
    };

    //bigBox样式
    let bigBoxWidth = (1 - proportionSmallBox) * magnifierWidth,
      bigBoxStyle = {width: bigBoxWidth, height: bigBoxWidth, display, ...radiusStyle};

    //bigImg样式
    let bigImgSlideLength = bigBoxWidth / proportion,
      positionProportion = proportion / (1 / proportionSmallBox - 1),
      bigImgStyle = {
        [max]: bigImgSlideLength,
        left: -markPosition.left / positionProportion,
        top: -markPosition.top / positionProportion
      };

    return (
      [
        <Button type="primary" onClick={this.handleSwitch} key="button">切换图片</Button>,
        <div className="Magnifier2" key="Magnifier2">
          <div className="smallBox" {...{
            style: smallBoxStyle
          }}>
            <div className="imgBox" {...{
              onMouseEnter: this.enterSmallBox,//鼠标进入图片
              onMouseLeave: this.leaveSmallBox,//鼠标离开图片
              onMouseMove: this.moveInSmallBox//鼠标在图片中移动
            }}>
              <div className="mark" {...{
                style: markStyle,
                ref: node => this.markNode = node
              }} />
              <img {...{
                src: smallImgSrc,
                style: smallImgStyle,
                ref: node => this.smallImg = node,
                onLoad: this.adjustImgSize,//图片加载完成
              }} alt=""/>
            </div>
          </div>
          <div className="bigBox" {...{
            style: bigBoxStyle
          }}>
            <img {...{
              src: bigImgSrc,
              style: bigImgStyle
            }} alt=""/>
          </div>
        </div>
      ]
    );
  }
}
const imgList = [
  {
    smallImgSrc: require('./images/kakaxi.jpg'),
    bigImgSrc: require('./images/kakaxi.jpg')
  }, {
    smallImgSrc: require('./images/peien.jpg'),
    bigImgSrc: require('./images/peien.jpg')
  }, {
    smallImgSrc: require('./images/caomaohaizeituan2.jpg'),
    bigImgSrc: require('./images/caomaohaizeituan2.jpg')
  }, {
    smallImgSrc: require('./images/caomaohaizeituan.jpg'),
    bigImgSrc: require('./images/caomaohaizeituan.jpg')
  }, {
    smallImgSrc: require('./images/qiwuhai.jpg'),
    bigImgSrc: require('./images/qiwuhai.jpg')
  }
];
Magnifier.defaultProps = {
  imgList, //数据源(供切换图片)
  proportion: 1 / 3, //mark占小盒子宽度的比例
  proportionSmallBox: 2 / 5, //小盒子占整行宽度的比例
  magnifierWidth: 1000, //设置整行的宽度
  isCircle: true, //mark和看到的大图片是否为圆形
  markOpacity: .7 //mark透明度
};
export default Magnifier;