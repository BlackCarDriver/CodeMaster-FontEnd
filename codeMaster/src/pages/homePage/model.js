import { codeMasterAPI } from '../../commom/services/example'
import {codeTypeFormater} from '../../commom/utils/util'

// 根据选中的类型筛选作品
function filterData (rawList, filterType) {
  let newList = []
  if (filterType != 99){
    newList = rawList.filter((v) => {return v.ctype == filterType})
  }else{
    newList = rawList.filter((v) => {return v.isRecommend})
  }
  return newList
}

// 根据输入框输入的关键字筛选作品列表
function filterDataByKeyWord (rawList, keyword) {
  let newList = []
  if (keyword === '') return newList
  newList = rawList.filter((v) => {
    if ( v.title.indexOf(keyword) >= 0) return true
    if ( v.author.indexOf(keyword) >= 0) return true
    if ( v.tagStr.indexOf(keyword) >= 0) return true
    if ( v.desc.indexOf(keyword) >= 0) return true
  })
  return newList
}

export default {
  namespace: 'homePage',
  state: {
    rawList: [],
    worksList: [],
    filterType: 99,
    filterKeyword: '',
  },

  reducers: {
    updateState (state, { payload }) {
      const { name, newValue } = payload
      return { ...state, [name]: newValue }
    },
    updateWorksList (state, { payload }) {
      const { rawList, filterType } = state
      return { ...state, worksList: filterData(rawList, filterType) }
    },
    updateWorksList2 (state, { payload }) {
      const { rawList, filterKeyword } = state
      return { ...state, worksList: filterDataByKeyWord(rawList, filterKeyword) }
    }
  },

  effects: {
    * queryWorksList ({ payload }, { select, call, put }) {
      let res = yield call(codeMasterAPI, '/home/getAllWorks', false)
      if (!res) {
        return
      }
      // 对一些字段做处理
      for(let i = 0; i < res.length; i++){
        res[i].tags = res[i].tagStr.split(' ', -1)
        res[i].typeStr = codeTypeFormater(res[i].ctype)
      }
      // 根据评分进行排序
      res = res.sort((a, b) => {
        return a.score < b.score ? 1 : -1
      })
      yield put({
        type: 'updateState',
        payload: { name: 'rawList', newValue: res }
      })
      yield put({ type: 'updateWorksList'})
    }
  }
}