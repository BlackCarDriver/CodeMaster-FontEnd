import { codeMasterAPI } from '../../commom/services/example'

export default {
  namespace: 'createCode',
  state: {
    displayList: []
  },

  reducers: {
    updateState (state, { payload }) {
      const { name, newValue } = payload
      return { ...state, [name]: newValue }
    }
  },

  effects: {
    * queryList ({ payload }, { select, call, put }) {
      yield put({
        type: 'updateState',
        payload: { name: 'displayList', newValue: [] }
      })
    },
    * codeDebug ( {payload}, {select, call, put}) {
      const {params, callbackFunc} = payload
      let res = yield call(codeMasterAPI, '/createCode/debug', params, true)
      callbackFunc(res)
    },
    * codeSubmit ( {payload}, {select, call, put}) {
      const {params, callbackFunc} = payload
      let res = yield call(codeMasterAPI, '/createCode/submit', params, true)
      if (!res) {
        callbackFunc(false, res)
      }else{
        callbackFunc(true, res)
      }
    },
  }
}