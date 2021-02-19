import React, { Component } from 'react'
import { connect } from 'dva'
import { Layout, Menu, Row, Col } from 'antd'
import { HomeOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Link } from 'dva/router'

@connect(({ wrapper }) => ({
  model: wrapper
}))

class Wrapper extends Component {
  componentDidMount = () => {
    console.debug('Wrapper init success')
  }

  render () {
    const { Header, Footer, Content } = Layout
    return (
      <Layout style={{minHeight: '100vh', width: '100vw', backgroundColor:'rgba(255, 255, 255, 0.3)'}}>
        <Header style={{backgroundColor:'white'}}>
          <div style={{float:'left', width:'120px', height:'31px'}} />
          <Menu theme='light' mode='horizontal' defaultSelectedKeys={['1']}>
            <Menu.Item key='1' icon={<HomeOutlined />}><Link to='/home'>算法广场</Link></Menu.Item>
            <Menu.Item key='2' icon={<ShareAltOutlined />}><Link to='/createCode'>作品分享</Link></Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Row>
            <Col xs={0} sm={1} md={2} />
            <Col xs={24} sm={22} md={20}>
              {this.props.children}
            </Col>
            <Col xs={0} sm={1} md={2} />
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          BlackCarBackDoor ©2021 Created by BlackCarDriver
        </Footer>
      </Layout>
    )
  }
}

export default Wrapper
