'use client';
import { Suspense, useCallback, useState } from "react";
import TreeStructure, { MyElement, TreeNode } from "./components/TreeStructure";
import { v4 as uuidv4 } from 'uuid';
import Deploy from "./components/Deploy";
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
    props: [],
    tagName: 'div',
    ...options,
  }), []);

  const [tree, setTree] = useState<TreeNode[]>([{"id":"6ae7e4e2-bfcd-4c98-a074-bc53e0bf4e65","name":"My counter","children":[{"id":"ac7a9c4a-4517-4b58-adc6-a367b29f65e9","name":"New node","children":[],"props":[{"key":"children","type":"string","value":"click me"},{"key":"onClick","type":"string","value":"##(e)=>{\nif('_myCount' in window){\nwindow._myCount ++;\n} else {\nwindow._myCount = 0\n}\nconsole.log('e', e)\ne.target.textContent = 'count '+window._myCount;\n}\n##"}],"tagName":"button"}],"props":[],"tagName":"main"}]);
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
  return (
    <main>
      <details><summary>Warning</summary>Do not enter unknown javascript code within {"##code-goes-here##"}, it may be malicious.</details>
      <details>
        <summary>Load trees</summary>
        {trees().map(treeName => (
          <div key={treeName} className="flex gap-8">
            <button onClick={() => loadTree(treeName)}>Load {treeName}</button>
            <button onClick={() => deleteTree(treeName)}>Delete {treeName}</button>
            <details><summary>JSON</summary><code><pre>{JSON.stringify(tree[0], null, 2)}</pre></code></details>
          </div>
        ))}
      </details>

      <button onClick={() => {
        saveTree(tree?.[0].name)
        alert("saved as '"+tree[0].name+"'")
      }}>Save Tree</button>
      
      
      <Suspense fallback={<div>Loading...</div>}>
        <TreeStructure id={id} tree={tree} setTree={setTree} createNode={createNode} renderType="both"/>
        <Deploy tree={tree} treeProps={{ setTree, createNode }} /> 
      </Suspense>
    </main>
  )
}