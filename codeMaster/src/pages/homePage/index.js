import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Row, Col, Input, Tabs } from 'antd'
import WorkCard from '../../commom/components/WorkCard'

const namespace = 'homePage'

@connect(({ homePage }) => ({
  model: homePage
}))

class HomePage extends Component {
  state = {
    title: 'SUCCESS'
  }
  componentDidMount = () => {
    this.callModel('queryWorksList')
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
    const { worksList } = this.props.model

    return (
      <Card bordered={false}>
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
                <WorkCard key={idx} id={item.id} title={item.title} imgsrc={item.img} author={item.author} types={item.types} desc={item.desc} tags={item.tags}/>
              )
            })
          }
        </Row>
      </Card>
    )
  }
}

export default HomePage
