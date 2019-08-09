const {
  test
} = require('../../dist/index.cjs');
const {
  html2json,
  json2html
} = require('html2json');
const chai = require('chai');
const expect = chai.expect;

describe('treewalk', () => {
  it('skull-show', (done) => {
    const ast = html2json(`
      <view class="page-container">
        <view skull-show>123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view hidden="{{false}}" wx:if="{{true}}">123</view></view>');
    done();
  });

  it('skull-remove', (done) => {
    const ast = html2json(`
      <view class="page-container">
        <view>123</view>
        <view skull-remove>123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view>123</view></view>');
    done();
  });
  
  it('skull-remove', (done) => {
    const ast = html2json(`
      <view class="page-container">
        <view>123</view>
        <view skull-remove>123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view>123</view></view>');
    done();
  });
  
  it('skull-bg', (done) => {
    // default
    {
      const ast = html2json(`
        <view class="page-container">
          <view skull-bg>123</view>
        </view>
      `)
      expect(json2html(test.treewalk(ast, {
        wxssInfo: new Map(),
        skeletonKeys: new Set(),
        usingComponentKeys: new Set(),
        isPage: true,
      }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-default-grey">123</view></view>');
    }
    
    // diy background
    {
      const ast = html2json(`
        <view class="page-container">
          <view skull-bg="rgb(1,2,3)">123</view>
        </view>
      `)
      expect(json2html(test.treewalk(ast, {
        wxssInfo: new Map(),
        skeletonKeys: new Set(),
        usingComponentKeys: new Set(),
        isPage: true,
      }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-bg-rgb123">123</view></view>');
    }
    done();
  });
  
  it('skull-dark-bg', (done) => {
    const ast = html2json(`
      <view class="page-container">
        <view skull-dark-bg>123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-default-dark-grey">123</view></view>');
    done();
  });
  
  it('skull-light-bg', (done) => {
    const ast = html2json(`
      <view class="page-container">
        <view skull-light-bg>123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-default-light-grey">123</view></view>');
    done();
  });
  
  it('skull-for', (done) => {
    // default
    {
      const ast = html2json(`
        <view class="page-container">
          <view skull-for="3">123</view>
        </view>
      `)
      expect(json2html(test.treewalk(ast, {
        wxssInfo: new Map(),
        skeletonKeys: new Set(),
        usingComponentKeys: new Set(),
        isPage: true,
      }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view wx:for="{{[1,1,1]}}" wx:key="{{index}}">123</view></view>');
    }

    // array
    {
      const ast = html2json(`
        <view class="page-container">
          <view skull-for="{{[1,2,3]}}">123</view>
        </view>
      `)
      expect(json2html(test.treewalk(ast, {
        wxssInfo: new Map(),
        skeletonKeys: new Set(),
        usingComponentKeys: new Set(),
        isPage: true,
      }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view wx:for="{{[1,2,3]}}" wx:key="{{index}}">123</view></view>');
    }
    done();
  });

  it('skull-clear', (done) => {
    const ast = html2json(`
      <view skull-clear class="page-container">
        <view >123</view>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"></view>');
    done();
  });
  
  it('skull-replace', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-replace="view" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view>123</view></view>');
    done();
  });
  
  it('skull-height', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-height="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-ht-10rpx skull-default-grey">123</view></view>');
    done();
  });
  
  it('skull-width', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-width="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-wd-10rpx skull-default-grey">123</view></view>');
    done();
  });
  
  it('skull-margin', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-margin="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-mg-10rpx skull-default-grey">123</view></view>');
    done();
  });
  
  it('skull-margin-top', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-margin-top="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-mgt-10rpx skull-default-grey">123</view></view>');
    done();
  });
  
  it('skull-padding', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-padding="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-pd-10rpx skull-default-grey">123</view></view>');
    done();
  });
  
  it('skull-padding-bottom', (done) => {
    const ast = html2json(`
      <view  class="page-container">
        <button skull-padding-bottom="10rpx" >123</button>
      </view>
    `)
    expect(json2html(test.treewalk(ast, {
      wxssInfo: new Map(),
      skeletonKeys: new Set(),
      usingComponentKeys: new Set(),
      isPage: true,
    }, true))).to.be.deep.equal('<view class="page-container" hidden="{{false}}" wx:if="{{true}}"><view class="skull-pdb-10rpx skull-default-grey">123</view></view>');
    done();
  });
});
