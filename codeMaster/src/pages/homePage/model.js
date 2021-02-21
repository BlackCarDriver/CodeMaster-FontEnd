export default {
  namespace: 'homePage',
  state: {
    worksList: []
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
    * queryWorksList ({ payload }, { select, call, put }) {
      let tempList = [
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
        {title:'花呗计算机', author: '黑车司机', img:'https://img-blog.csdnimg.cn/20210221143438117.PNG', types: '生活问题', desc: '计算你的花呗利息', tag: '花呗;利息计算;利率;利益'},
      ]
      // 对一些字段做处理
      for(let i = 0; i < tempList.length; i++){
        tempList[i].tags = tempList[i].tag.split(';', -1)
      }

      yield put({
        type: 'updateState',
        payload: { name: 'worksList', newValue: tempList }
      })
    }
  }
}