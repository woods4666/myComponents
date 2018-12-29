import React from 'react';
import LazyImg from './LazyImg/LazyImg';
class LazyImages extends React.Component {
  imgList = {};

  componentDidMount() {
    this.lazyLoad();
    window.addEventListener('scroll', this.lazyLoad, false)
  }

  componentWillReceiveProps() {
    this.lazyLoad();
  }

  lazyLoad = () => {
    Object.values(this.imgList).forEach(img => {
      !img.loaded && img.loadImg();
    });
  };

  render() {
    let {dataSource, defaultImg} = this.props;
    let imgList = dataSource.map((itemData, index) => {
      return <LazyImg {...{
        key: index,
        ref: node => this.imgList[`img${index}`] = node,
        itemData,
        defaultImg
      }}/>
    });

    return (
      <div className="container">
        {imgList}
      </div>
    );
  }
}
var data = [
  {
    src: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3581792254,1787772481&fm=173&app=25&f=JPEG?w=218&h=146&s=DBACB7475B8662D2062E5B6D0300E068',
    title: '分析师观点｜中国股市需要华为精神'
  },
  {
    src: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=180312266,3639093672&fm=173&app=25&f=JPEG?w=218&h=146&s=5A27AE40185A464F0AABF952030050FA',
    title: '内地与港澳人士热议港珠澳大桥：为大湾区发展带来新机遇'
  }
];
data = [...new Array(40)].map((item, index) => {
  item = data[index % 2];
  return item;
});

LazyImages.defaultProps = {
  dataSource: data,
  defaultImg: 'https://misc.360buyimg.com/mtd/pc/index_2017/2.1.0/static/images/lazyload.gif'
};
export default LazyImages;
