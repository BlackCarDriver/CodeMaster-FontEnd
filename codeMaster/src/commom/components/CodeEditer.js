import React, { Component } from 'react'

class CodeEditer extends Component {
  render (){
    console.debug(window)
    const {hljs} = window
    const { code } = this.props
    return(
      <div style={{backgroundColor:'#f4f4f4', padding:'1em'}}>
        <pre><code dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code).value }}/></pre>
      </div>
    )
  }
}

export default CodeEditer