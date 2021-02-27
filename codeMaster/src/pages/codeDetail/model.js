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
      type: '?',
      language: '?',
      tags: [],
      desc: '?',
      code: '?',
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
        type: '1',
        language: 'go',
        tagSrc: '花呗;利息;金融',
        desc: '一个帮助你计算花呗应还金额的算法，帮助你更好理财哦~',
        code: `<Col span={12}>
        <Card>
          <Form.Item>
            <Input placeholder='这里输入昵称' defaultValue='隐形巨老' maxLength={30}/>
          </Form.Item>
          <Form.Item>
            <TextArea rows={1} placeholder='说些东西吧...' maxLength={250}/>
          </Form.Item>
          <Form.Item style={{marginBottom:'0'}}>
            <Button htmlType='submit' type='primary'>发表评论</Button>
          </Form.Item>
        </Card>
      </Col>`
      }
      codeDetail.tags = codeDetail.tagSrc.split(';', -1)
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