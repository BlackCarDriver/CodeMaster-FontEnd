import { codeMasterAPI } from '../../commom/services/example'
import {codeTypeFormater} from '../../commom/utils/util'


function filterData (rawList, filterType) {
  let newList = []
  if (filterType != 99){
    newList = rawList.filter((v) => {return v.ctype == filterType})
  }else{
    newList = rawList.filter((v) => {return v.isRecommend})
  }
  return newList
}

export default {
  namespace: 'homePage',
  state: {
    rawList: [],
    worksList: [],
    filterType: 99,
  },

  reducers: {
    updateState (state, { payload }) {
      const { name, newValue } = payload
      return { ...state, [name]: newValue }
    },
    updateWorksList (state, { payload }) {
      const { rawList, filterType } = state
      return { ...state, worksList: filterData(rawList, filterType) }
    }
  },

  effects: {
    * queryWorksList ({ payload }, { select, call, put }) {
      let res = yield call(codeMasterAPI, '/home/getAllWorks', false)
      if (!res) {
        return
      }
      // let tempList = [
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      //   {id: 123, title:'花呗计算机', author: '黑车司机', coverUrl:'https://img-blog.csdnimg.cn/20210221143438117.PNG', ctype: 1, desc: '计算你的花呗利息', tagStr: '花呗 利息计算 利率 利益'},
      // ]
      // res = tempList
      // 对一些字段做处理
      for(let i = 0; i < res.length; i++){
        res[i].tags = res[i].tagStr.split(' ', -1)
        res[i].typeStr = codeTypeFormater(res[i].ctype)
      }
      yield put({
        type: 'updateState',
        payload: { name: 'rawList', newValue: res }
      })
      yield put({ type: 'updateWorksList'})
    }
  }
}