/**
 * Created by Administrator on 2018/12/30 0030.
 */
import React from 'react';
import './Magnifier2.less';
import {Button} from 'antd';
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
class Magnifier extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 'width',
      imgIndex: 0,
      isEnterSmallBox: false,
      markPosition: {
        left: 0,
        top: 0
      }
    };
  }

  adjustImgSize = () => {
    let {offsetWidth, offsetHeight} = this.smallImg;
    this.setState({
      max: offsetWidth >= offsetHeight ? 'width' : 'height'
    });
  };
  handleSwitch = () => {
    this.setState(preState => ({
      imgIndex: preState.imgIndex >= imgList.length - 1 ? 0 : preState.imgIndex + 1
    }));
  };

  enterSmallBox = e => {
    console.log('enterSmallBox');
    this.setState({
      isEnterSmallBox: true
    });
  };
  leaveSmallBox = e => {
    console.log('leaveSmallBox');
    this.setState({
      isEnterSmallBox: false
    });
  };
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
  moveInSmallBox = e => {
    this.setMarkPosition(e);
  };
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

  render() {
    let {proportion, proportionSmallBox, magnifierWidth, isCircle, markOpacity} = this.props,
      {isEnterSmallBox, markPosition} = this.state,
      display = isEnterSmallBox ? 'block' : 'none',
      opacity = isEnterSmallBox ? markOpacity : 0,
      smallBoxWidth = proportionSmallBox * magnifierWidth,
      smallBoxStyle = {width: smallBoxWidth, height: smallBoxWidth, background: 'yellow'},
      radiusStyle = isCircle ? {borderRadius: '50%'} : {},
      bigBoxWidth = (1 - proportionSmallBox) * magnifierWidth,
      bigBoxStyle = {width: bigBoxWidth, height: bigBoxWidth, display, ...radiusStyle},
      markWidth = proportion * smallBoxWidth,
      markStyle = {
        width: markWidth,
        height: markWidth,
        opacity,
        left: markPosition.left,   //动态
        top: markPosition.top,   //动态
        ...radiusStyle
      },
      smallImgStyle = {
        [this.state.max]: smallBoxWidth
      },
      bigImgBoxWidth = bigBoxWidth / proportion,
      positionProportion = proportion / (1 / proportionSmallBox - 1),
      bigImgStyle = {
        [this.state.max]: bigImgBoxWidth,
        left: -markPosition.left / positionProportion, //动态的
        top: -markPosition.top / positionProportion //动态的
      };
    let {imgIndex} = this.state,
      {smallImgSrc, bigImgSrc} = imgList[imgIndex];
    return (
      [
        <Button type="primary" onClick={this.handleSwitch} key="button">切换图片</Button>,
        <div className="Magnifier2" key="Magnifier2">
          <div className="smallBox" {...{
            style: {...smallBoxStyle}
          }}>
            <div className="imgBox" {...{
              onMouseEnter: this.enterSmallBox,
              onMouseLeave: this.leaveSmallBox,
              onMouseMove: this.moveInSmallBox
            }}>
              <div className="mark" {...{
                style: {...markStyle},
                ref: node => this.markNode = node
              }}></div>
              <img {...{
                src: smallImgSrc,
                style: {...smallImgStyle},
                ref: node => this.smallImg = node,
                onLoad: this.adjustImgSize,
              }} alt=""/>
            </div>
          </div>
          <div className="bigBox" style={{...bigBoxStyle}}>
            <img {...{
              src: bigImgSrc,
              style: {...bigImgStyle}
            }} alt=""/>
          </div>
        </div>
      ]
    );
  }
}
Magnifier.defaultProps = {
  proportion: 1 / 3,
  proportionSmallBox: 2 / 5,
  magnifierWidth: 1000,
  isCircle: true,
  markOpacity: .7
};
export default Magnifier;