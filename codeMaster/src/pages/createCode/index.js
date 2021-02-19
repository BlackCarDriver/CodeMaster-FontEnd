import React, { Component } from 'react'
import { connect } from 'dva'
import { Card } from 'antd'

const namespace = 'createCode'

@connect(({ createCode }) => ({
  model: createCode
}))

class CreateCode extends Component {
  state = {
    title: 'createCode'
  }
  componentDidMount = () => {
    console.debug('init success')
  }

  // 调用 model 处理函数
  callModel = (funcName, params) => {
    const { dispatch } = this.props
    dispatch({
      type: `${namespace}/${funcName}`,
      payload: params
    })
  }
  // 修改单个model state 成员
  changeState = (name, newValue) => {
    this.callModel('updateState', {
      name: name, newValue: newValue
    })
  }

  render () {
    const { route } = this.props
    return (
      <Card>
        <h1>{this.state.title}</h1>
      </Card>
    )
  }
}

export default CreateCode
