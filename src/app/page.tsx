'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import TreeStructure, { MyElement, TreeNode } from "./components/TreeStructure";
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify'
const listSavedTrees = ({ id = uuidv4() }: MyElement) => {
  const trees = [];
  if(typeof window != 'undefined'){
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('treeData' + id)) {
        trees.push(key.split(':')[1]); // Extracting the root name
      }
    }
  }
  return trees;
}
export default function Home() {
  const createNode = useCallback((options: Partial<TreeNode> = {}) => ({
    id: uuidv4(),
    name: 'New node',
    children: [],
    data: [],
    tagName: 'div',
    ...options,
  }), []);
  const [tree, setTree] = useState<TreeNode[]>([createNode({ name: 'Root node', tagName: 'Fragment', })]);
  const id = 'willow-tree'
  const loadTree = (rootName: string) => {
    if(rootName && typeof window !== 'undefined'){
      const savedTreeData = window.localStorage.getItem('treeData' + id + ':' + rootName);
      if (savedTreeData) {
        setTree(JSON.parse(savedTreeData));
      }
    }
  };
  const saveTree = (saveName: string) => {
    if (saveName && typeof window !== 'undefined') {
      window.localStorage.setItem('treeData' + id + ':' + saveName, JSON.stringify(tree));
    } else {
      alert('Please enter a name to save the tree');
    }
  };
  const deleteTree = (deleteName: string) => {
    const confirmed = confirm("Confirm delete " + deleteName)
    if (confirmed) {
      if (deleteName && typeof window !== 'undefined') {
        window.localStorage.removeItem('treeData' + id + ':' + deleteName)
        setTree((tree: TreeNode[]) => {
          
          if(tree[0].name === deleteName){
            return []
          }
          return tree
        })
      }
    } else {
      // delete cancelled
    }
  }
  const trees = useCallback(() => listSavedTrees({ id }), [id, tree])
  // const [deployNameEdited, setDeployNameEdited] = useState(false)
  // const [deployName, setDeployName] = useState('')
  // useEffect(() => {
  //   if(!deployNameEdited && tree.length){
  //     setDeployName(tree[0].name)
  //   }
  // }, [tree, deployNameEdited])
  // const deployKey = useMemo(() => `dev-${slugify(deployName.toLowerCase())}`, [deployName])
  // const deployUrl = useMemo(() => {
  //   return `https://www.${deployKey}.vercel.app`
  // }, [deployKey])
  return (
    <main>
      <details>
        <summary>Load trees</summary>
        {trees().map(treeName => (
          <div key={treeName} className="flex gap-8">
            <button onClick={() => loadTree(treeName)}>Load {treeName}</button>
            <button onClick={() => deleteTree(treeName)}>Delete {treeName}</button>
          </div>
        ))}
      </details>

      <button onClick={() => {
        saveTree(tree?.[0].name)
        alert("saved as '"+tree[0].name+"'")
      }}>Save Tree</button>
      
      <TreeStructure id={id} tree={tree} setTree={setTree} createNode={createNode} />
      {/* <details>
        <summary>Deploy</summary>
        <div>
          <input type="text" value={deployName} onChange={(e: any) => {
            setDeployName(e.target.value)
            if(!deployNameEdited) setDeployNameEdited(true)
          }}
        />
        <button>Deploy to {deployUrl}</button>
        </div>
      </details> */}
    </main>
  )
}