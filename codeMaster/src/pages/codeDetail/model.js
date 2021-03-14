export default {
  namespace: 'codeDetail',
  state: {
    commentList: [],
    codeMessag:{
      id: 0,
      title: '?',
      imgSrc: '?',
      author: '?',
      timestamp: 0,
      score: 0,
      ctype: '?',
      language: '?',
      inputDesc:'', // 输入描述
      inputDemo:'', // 输入例子
      tags: [], // 标签字符串,使用';'隔开每个标签
      desc: '?', // 简介
      code: '?',
      ouputDemo: '',
    },
  },

  reducers: {
    updateState (state, { payload }) {
      const { name, newValue } = payload
      return { ...state, [name]: newValue }
    }
  },

  effects: {
    * queryCodeMessage ({ payload }, { select, call, put }) {
      let codeDetail = {
        id: 0,
        title: '花呗计算器',
        imgSrc: 'https://s.cn.bing.net/th?id=ODL.43dbcf956265593b1ae5870324172b9c&w=94&h=131&c=7&rs=1&qlt=80&pid=RichNav',
        author: 'BlackCarDriver',
        timestamp: 1614418811,
        score: 4.6,
        ctype: '1',
        language: 'go',
        tagSrc: '花呗;利息;金融',
        desc: '一个帮助你计算花呗应还金额的算法，帮助你更好理财哦~',
        inputDesc: `第一行输入总金额，单位元如：20000
第二行输入年化率，若为3%则输入：0.03`,
        inputDemo: '10000 0.03',
        ouputDemo: '11233.3454',
        code: `import React, { Component } from 'react'

        class CodeEditer extends Component {
          render (){
            const { code } = this.props
            return(
              <div style={{backgroundColor:'#f4f4f4', padding:'1em'}}>
                <pre><code dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code).value }}/></pre>
              </div>
            )
          }
        }
        
        export default CodeEditer`
      }
      codeDetail.tags = codeDetail.tagSrc.split(' ', -1)
      yield put({
        type: 'updateState',
        payload: { name: 'codeMessag', newValue: codeDetail }
      })
    },
    * queryCommentList ({ payload }, { select, call, put }) {
      const commentList = [
        {author:'BlackCarDri', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
        {author:'BlackCarDriv', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
        {author:'BlackCarDrive', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
        {author:'BlackCarDriver', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
        {author:'BlackCarDriver2', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
        {author:'BlackCarDriver', timestamp:1614403507, imgSrc:'https://s.cn.bing.net/th?id=ODL.ece8b589cb3bf04f49f0cb6c7cdb12c8&w=94&h=131&c=7&rs=1&qlt=80&pid=RichNav', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      ]
      console.debug('commentList=', commentList)
      yield put({
        type: 'updateState',
        payload: { name: 'commentList', newValue: commentList }
      })
    }
  }
}