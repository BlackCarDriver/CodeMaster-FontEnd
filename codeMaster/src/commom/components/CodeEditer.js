import React, { Component } from 'react'
import style from './style.css'

class CodeEditer extends Component {
  render (){
    const { code } = this.props
    return(
      <div>
        <pre><code className='language-html'>{code}</code></pre>
      </div>
    )
  }
}

export default CodeEditer