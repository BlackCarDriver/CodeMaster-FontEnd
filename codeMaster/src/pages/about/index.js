import React, { Component} from 'react'
import { Row, Col, Typography, Space, Image } from 'antd'

class NotFound extends Component {
  render () {
    const { Text, Link, Title, Paragraph } = Typography
  	return (
      <Row>
        <Col span={18} pull={3} push={3}>
          <Title>关于本站</Title>
          <Row>
            <Typography>
              <Paragraph>
               CodeMaster (算法高手/代码托管平台), 2021年个人毕业设计，感谢使用。。。
              </Paragraph>
              <Space direction='vertical'>
                <Text type='secondary'>作者：<Text>BlackCarDriver  👇</Text></Text>
                <Image width={180} src='https://img-blog.csdnimg.cn/20210417234231775.jpg' />
                <Text type='secondary'>联系方式：<Link>BlackCarDriver@qq.com </Link> (反馈/建议...)</Text>
                <Text type='secondary'>源码地址：<Link> https://github.com/BlackCarDriver/CodeMaster-FontEnd</Link></Text>
              </Space>
            </Typography>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default NotFound