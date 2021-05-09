import React, { Component } from 'react'
import { connect } from 'dva'
import { Layout, Menu, Row, Col, Switch, Tooltip } from 'antd'
import { HomeOutlined, ShareAltOutlined, CoffeeOutlined, GithubOutlined, SoundOutlined, NotificationOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { Link } from 'dva/router'

@connect(({ wrapper }) => ({
  model: wrapper
}))


class Wrapper extends Component {
  musicList = [
    '5235405887',
    '2470279320',
    '6638140300',
    '2728366755',
    '2904775623',
    '3034253258',
    '2304355566',
    '5279428220',
    '2845117958',
    '2309853934',
    '5143588212',
    '2200671711',
    '5143415783',
  ]
  componentDidMount = () => {
    console.debug(this.props.location.pathname.substring(1))
    this.setState({activityKey: this.props.location.pathname.substring(1)})
    let timestamp = (new Date()).valueOf()
    let randInt = parseInt(timestamp % this.musicList.length)
    this.setState({musicID: this.musicList[randInt]})
  }

  state = {
    activityKey: 'home',
    netEasyIframDisplay: false,
    musicID: ''
  }
  render () {
    const { Header, Footer, Content } = Layout
    const { activityKey, netEasyIframDisplay, musicID } = this.state
    return (
      <Layout style={{minHeight: '100vh', width: '100vw', minWidth:'1200px', backgroundColor:'rgba(255, 255, 255, 0.3)'}}>
        <Header style={{backgroundColor:'white', padding:'0'}}>
          <a style={{float:'left', width:'200px', height:'100%'}} >
            <img src='./assets/logo.PNG' alt='logo' style={{width:'100%', height:'100%'}} />
          </a>
          <Menu theme='light' mode='horizontal' key={activityKey} defaultSelectedKeys={[activityKey]}>
            <Menu.Item key='home' icon={<HomeOutlined />}><Link to='/home'>算法广场</Link></Menu.Item>
            <Menu.Item key='createCode' icon={<ShareAltOutlined />}><Link to='/createCode'>作品分享</Link></Menu.Item>
            <Menu.Item key='about' icon={<CoffeeOutlined />}><Link to='/about'>关于本站</Link></Menu.Item>
            <a style={{position:'absolute', right:'80px', fontSize:'1.4em'}}>
              <Tooltip title='BlackCarDriver的歌单'>
                <CustomerServiceOutlined onClick={() => this.setState({netEasyIframDisplay: !netEasyIframDisplay})}/>
              </Tooltip>
            </a>
            <a href='https://github.com/BlackCarDriver/CodeMaster-FontEnd' target='blank' style={{position:'absolute', right:'1em', fontSize:'1.9em'}}><GithubOutlined /></a>
          </Menu>
        </Header>
        <Content style={{marginTop: '1em'}}>
          <iframe hidden={!netEasyIframDisplay} style={{position:'absolute', right:'2em', top:'5em', zIndex:'100', width:330, height:450, frameBorder:'no', border:'0', marginwidth:'0', marginheight:'0'}} src={`//music.163.com/outchain/player?type=0&id=${musicID}&auto=0&height=430`}></iframe>
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
