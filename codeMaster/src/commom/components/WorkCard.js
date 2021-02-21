/* eslint-disable react/react-in-jsx-scope */
import React, { Component } from 'react'
import { Avatar, Row, Col, Divider, Typography, Tooltip, Rate } from 'antd'
import { UserOutlined, RightOutlined } from '@ant-design/icons'
import style from './style.css'


class WorkCard extends Component {
  render () {
    const {title, types, author, desc, imgsrc, tags} = this.props
    console.debug(this.props)
    const { Text, Paragraph } = Typography
    return (
      <div className={style.myCard}>
        <Row style={{height: '60px'}}>
          <Col span={5}>
            <Avatar shape='square' style={{width:'100%', height:'100%'}} src={imgsrc} />
          </Col>
          <Col offset={1} span={18}>
            <Row style={{height: '50%'}}>
              <Col span={16} className={style.col1}><a className={style.myTitle}>{title}</a></Col>
              <Col span={8} className={style.col1}><a className={style.myType}>[{types}]</a></Col>
            </Row>
            <Row align='bottom' style={{height: '50%'}}>
              <Col span={18} className={style.col1}><Tooltip title='作者昵称'><a><UserOutlined /> {author}</a></Tooltip></Col>
              <Col span={6} className={style.goto}><a>前往<RightOutlined /></a></Col>
            </Row>
          </Col>
        </Row>
        <Divider style={{margin:'8px 0px 0px 0px'}}/>
        <Row>
          <Col span={10}><Rate allowHalf value={4.5} disabled className={style.rate}/></Col>
          <Col span={14}>
            <Paragraph ellipsis>
              {tags ? tags.map((item,idx) => {return <Text key={idx} code>{item}</Text>}) : ''}
            </Paragraph>
          </Col>
        </Row>
        <Row>
          <Text className={style.desc} ellipsis type='secondary'>{desc}</Text>
        </Row>
      </div>
    )
  }
}

export default WorkCard


