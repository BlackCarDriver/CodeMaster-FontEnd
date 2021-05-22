import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Row, Col, Input, Tabs } from 'antd'
import WorkCard from '../../commom/components/WorkCard'
import { trySeveralTimes, codeTypeFormater } from '../../commom/utils/util'

const namespace = 'homePage'

@connect(({ homePage }) => ({
  model: homePage
}))

class HomePage extends Component {
  state = {
    boxPadding: 0,
  }
  componentDidMount = () => {
    this.callModel('queryWorksList')
    console.debug('width=', window.screen.width)
    if (window.screen.width < 1000) {
      alert('为获得更好的使用体验，请到电脑浏览器上使用🔊')
    }
    let setMiddle = () => { // 让题目卡片居中显示
      if (!this.boxref) {
        return false
      }
      const {scrollWidth} = this.boxref
      const prebox = 327
      let needWidth = 0
      for (let i = 1; i * prebox < scrollWidth; i++ ){
        let res = scrollWidth - i * prebox
        needWidth = i * prebox
      }
      this.setState({boxPadding: (scrollWidth - needWidth - 48) / 2})
      return true
    }
    trySeveralTimes(setMiddle, 1000, 10)
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

  // 搜索关键字
  onSearch = (v) => {
    this.callModel('updateWorksList2')
  }
  onTabChange = (v) => {
    console.debug('tab changed value=', v)
    this.changeState('filterType', v)
    this.callModel('updateWorksList')
  }

  render () {
    const { Search } = Input
    const { TabPane } = Tabs
    const { boxPadding } = this.state
    const { worksList } = this.props.model

    return (
      <div ref={box => {this.boxref = box}}>
        <Card bordered={false} style={{padding: `0 ${boxPadding}px`}}>
          <Row align='middle'>
            <Col offset={8} span={8}><Search placeholder='关键字,作者,类别,标签...' size='middle' onChange={(v) => this.changeState('filterKeyword', v.target.value)} onSearch={v => {this.onSearch(v)}} enterButton /></Col>
          </Row>
          <Row>
            <Tabs onChange={v => {this.onTabChange(v)}} type='line' style={{width:'100%'}} defaultActiveKey='recommend'>
              <TabPane tab='站长推荐' key={99}> </TabPane>
              <TabPane tab={codeTypeFormater(1)} key={1}> </TabPane>
              <TabPane tab={codeTypeFormater(2)} key={2}> </TabPane>
              <TabPane tab={codeTypeFormater(3)} key={3}> </TabPane>
              <TabPane tab={codeTypeFormater(4)} key={4}> </TabPane>
              <TabPane tab={codeTypeFormater(0)} key={0}> </TabPane>
            </Tabs>
          </Row>
          <Row>
            {
              worksList.map((item, idx) => {
                return (
                  <WorkCard key={idx} id={item.id} title={item.title} imgsrc={item.coverUrl}
                    author={item.author} types={item.typeStr} desc={item.desc}
                    tags={item.tags} score={item.score}/>
                )
              })
            }
          </Row>
        </Card>
      </div>
    )
  }
}

export default HomePage
