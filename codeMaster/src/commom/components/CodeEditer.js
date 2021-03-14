import React, { Component } from 'react'
{/* <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/github.min.css">
<script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/highlight.min.js"></script> */}
class CodeEditer extends Component {
  render (){
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