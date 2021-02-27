import React, { Component } from 'react'
import { Comment, Tooltip, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import moment from 'moment'


class CommentList extends Component {

  getRandomColor = (name) => {
    const colorList = ['#f56a00', '#87d068', '#1890ff', '##50cc18', '#eab436', '#f759ed', '#fd5c5c']
    return colorList[name.length % colorList.length]
  }

  render (){
    const {id, author, desc, imgSrc, timestamp} = this.props
    return (
      <div>
        <Comment
          avatar={ imgSrc ?
            <Avatar alt={author ? author : ''} src={imgSrc ? imgSrc : ''}/> :
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
          }
          author={<a>{author ? author : ''}</a>}
          content={ <p>{desc ? desc : ''}</p>}
          datetime={
            <Tooltip title={moment(timestamp ? timestamp * 1000 : 0).format('YYYY-MM-DD HH:mm:ss')}>
              <span>{moment(timestamp ? timestamp * 1000 : 0).fromNow()}</span>
            </Tooltip>
          }
        />
      </div>
    )
  }
}

export default CommentList