import React, { Component } from 'react'
import { Result, Button } from 'antd'

class NotFound extends Component {
  render () {
    window.isInit = true
  	return (
      <Result status='404' title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={<Button type='primary'>Go Back</Button>}>
      </Result>
    )
  }
}

export default NotFound
