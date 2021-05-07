import { codeMasterAPI } from '../../commom/services/example'

export default {
  namespace: 'codeDetail',
  state: {
    commentList: [],
    codeMessage:{
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
    // 查询作品详细信息
    * queryCodeMessage ({ payload }, { select, call, put }) {
      // let codeDetail = {
      //   id: 0,
      //   title: '花呗计算器',
      //   coverUrl: 'https://s.cn.bing.net/th?id=ODL.43dbcf956265593b1ae5870324172b9c&w=94&h=131&c=7&rs=1&qlt=80&pid=RichNav',
      //   author: 'BlackCarDriver',
      //   timestamp: 1614418811,
      //   score: 4.6,
      //   ctype: '1',
      //   language: 'go',
      //   tagSrc: '花呗;利息;金融',
      //   desc: '一个帮助你计算花呗应还金额的算法，帮助你更好理财哦~',
      //   inputDesc: `第一行输入总金额，单位元如：20000
      // 第二行输入年化率，若为3%则输入：0.03`,
      //   demoInput: '10000 0.03',
      //   demoOuput: '11233.3454',
      //   code: `import React, { Component } from 'react'

      //         class CodeEditer extends Component {
      //           render (){
      //             const { code } = this.props
      //             return(
      //               <div style={{backgroundColor:'#f4f4f4', padding:'1em'}}>
      //                 <pre><code dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code).value }}/></pre>
      //               </div>
      //             )
      //           }
      //         }
      //         export default CodeEditer`
      // }
      // codeDetail.tags = codeDetail.tagSrc.split(' ', -1)

      const {codeID} = payload
      console.debug('codeID=', codeID)
      let res = yield call(codeMasterAPI, `/codeDetail/getDetailByID?id=${codeID}`, null, false)
      console.debug('res=', res)
      if (!res) {
        return
      }
      res.tags = res.tagStr.split(' ', -1)

      yield put({
        type: 'updateState',
        payload: { name: 'codeMessage', newValue: res }
      })
    },
    // 查询评论列表
    * queryCommentList ({ payload }, { select, call, put }) {
      // const commentList = [
      //   {author:'BlackCarDri', timestamp:1614403507, imgSrc:'', desc: '<span key="comment-basic-reply-to">Reply to</span>'},
      // ]
      // console.debug('commentList=', commentList)
      const {codeID} = payload
      console.debug('codeID=', codeID)
      let res = yield call(codeMasterAPI, `/codeDetail/getCommentList?workId=${codeID}`, null, false)
      console.debug('res=', res)
      if (!res) {
        return
      }
      yield put({
        type: 'updateState',
        payload: { name: 'commentList', newValue: res }
      })
    },
    // 提交评论
    *subMitComment ({payload}, {select, call, put}) {
      const {params, callbackFunc} = payload
      let res = yield call(codeMasterAPI, '/codeDetail/submitComment', params, true)
      console.debug('res=', res)
      if (res) {
        callbackFunc(true)
      }else{
        callbackFunc(false)
      }
    },
    // 执行算法
    *runWork ({payload}, {select, call, put}) {
      const {params, callbackFunc} = payload
      let res = yield call(codeMasterAPI, '/codeDetail/runWork', params, true)
      if (!res) {
        callbackFunc(false, '')
        return
      }
      const { stdErr, stdOut } = res
      console.debug(res)
      if (stdErr != '') {
        callbackFunc(false, stdErr)
        return
      }
      callbackFunc(true, stdOut)
    }
  }
}