import React, { Component } from 'react'
import { connect } from 'dva'
import { Layout, Menu, Row, Col } from 'antd'
import { HomeOutlined, ShareAltOutlined, CoffeeOutlined } from '@ant-design/icons'
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
        <Header style={{backgroundColor:'white', padding:'0'}}>
          <a style={{float:'left', width:'200px', height:'100%'}} >
            <img src='./assets/logo.PNG' alt='logo' style={{width:'100%', height:'100%'}} />
          </a>
          <Menu theme='light' mode='horizontal' defaultSelectedKeys={['1']}>
            <Menu.Item key='1' icon={<HomeOutlined />}><Link to='/home'>算法广场</Link></Menu.Item>
            <Menu.Item key='2' icon={<ShareAltOutlined />}><Link to='/createCode'>作品分享</Link></Menu.Item>
            <Menu.Item key='3' icon={<CoffeeOutlined />}><Link to='/about'>关于本站</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{marginTop: '1em'}}>
          <Row>
            <Col xs={0} sm={1} md={2} />
            <Col xs={24} sm={22} md={20}>
              {this.props.children}
            </Col>
            <Col xs={0} sm={1} md={2} />
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          CodeMaster ©2020 Created by <a href='https://github.com/BlackCarDriver'>BlackCarDriver</a> <br/>
                粤ICP备2020127063号-1
        </Footer>
      </Layout>
    )
  }
}

export default Wrapper
