import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import slugify from 'slugify'
import TreeStructure, { TreeNode } from './TreeStructure'

function Projects(){
  const [data, setData] = useState({ data: { projects: { projects: [] }} })
  const handleGenerateReport = useCallback(() => {
    fetch('/api/report', {
      method: 'get',
    })
    .then(res => res.json())
    .then(res => {
      console.log('report:', res)
      setData(res)
    })
    .catch((err) => {
      console.error(err)
    })
  }, [])

  return <><button onClick={() => {
    handleGenerateReport()
  }}>Generate report</button><ul>{data.data.projects.projects.map((project: any) => { 
    return <li key={project.id}>
      {project.name}
    </li>
  })}</ul></>
}


type DeployProps = {
  tree: TreeNode[];
  treeProps: any;
}
function Deploy({ tree, treeProps }: DeployProps) {
  const treeRef = useRef<HTMLDivElement>(null)
    const [deployNameEdited, setDeployNameEdited] = useState(false)
  const [deployName, setDeployName] = useState('')
  useEffect(() => {
    if(!deployNameEdited && tree.length){
      setDeployName(tree[0].name)
    }
  }, [tree, deployNameEdited])
  const deployKey = useMemo(() => `dev-${slugify(deployName.toLowerCase())}`, [deployName])
  const deployUrl = useMemo(() => {
    return `https://www.${deployKey}.vercel.app`
  }, [deployKey])
  const [html, setHtml] = useState('')
  
  return (
    <details>
      <summary>Review</summary>
      <div>
        <input type="text" value={deployName} onChange={(e: any) => {
          setDeployName(e.target.value)
          if(!deployNameEdited) setDeployNameEdited(true)
        }}
      />
      </div>
      <details>
      <summary>JSX</summary>
      <TreeStructure ref={treeRef} id='willow-tree-jsx' tree={tree} {...treeProps} renderType="jsx" onUpdateTree={(el, tree) => {
        if(el) setHtml(JSON.stringify(tree, null, 2))
      }}/>
      <code><pre>{html}</pre></code>
      <Projects/>
      </details>
    </details>
  )
}

export default Deploy