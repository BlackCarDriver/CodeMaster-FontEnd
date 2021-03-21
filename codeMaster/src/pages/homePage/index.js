import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Row, Col, Input, Tabs } from 'antd'
import WorkCard from '../../commom/components/WorkCard'
import { trySeveralTimes } from '../../commom/utils/util'

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
    let setMiddle = () => { // 让题目卡片居中显示
      if (!this.boxref) {
        return false
      }
      console.debug('this.boxref=', this.boxref)
      const {scrollWidth} = this.boxref
      const prebox = 327
      let needWidth = 0
      for (let i = 1; i * prebox < scrollWidth; i++ ){
        let res = scrollWidth - i * prebox
        needWidth = i * prebox
      }
      console.debug('scrollWidth=', scrollWidth, 'needWidth=', needWidth)
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
    console.debug('search value=', v)
  }
  onTabChange = (v) => {
    console.debug('tab changed value=', v)
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
            <Col offset={8} span={8}><Search placeholder='关键字,作者,类别,标签...' size='middle' onSearch={v => {this.onSearch(v)}} enterButton /></Col>
          </Row>
          <Row>
            <Tabs onChange={v => {this.onTabChange(v)}} type='line' style={{width:'100%'}} defaultActiveKey='recommend'>
              <TabPane tab='站长推荐' key='recommend'> </TabPane>
              <TabPane tab='生活问题' key='live'> </TabPane>
              <TabPane tab='数据结构' key='dataStruct'> </TabPane>
              <TabPane tab='程序开发' key='development'> </TabPane>
              <TabPane tab='趣味/恶搞' key='funny'> </TabPane>
              <TabPane tab='全部作品...' key='all'> </TabPane>
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
