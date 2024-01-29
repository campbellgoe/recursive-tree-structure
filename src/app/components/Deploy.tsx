import React, { useEffect, useMemo, useRef, useState } from 'react'
import slugify from 'slugify'
import TreeStructure, { TreeNode } from './TreeStructure'

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
      <TreeStructure ref={treeRef} id='willow-tree-jsx' tree={tree} {...treeProps} renderType="jsx" onUpdateTree={el => {
        if(el) setHtml(el.innerHTML)
      }}/>
      <code><pre>{html}</pre></code>
      Click to
      <button onClick={() => {
        // TODO: Implement deploy to vercel
      }}>Generate report</button>
      </details>
    </details>
  )
}

export default Deploy