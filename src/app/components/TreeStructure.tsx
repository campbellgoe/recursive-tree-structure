'use client';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface KeyValue {
  key: string;
  value: string;
}

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data?: KeyValue[];
}

const TreeStructure: React.FC = () => {
  const createNode = (o = {}) => ({
    id: uuidv4(),
    name: 'New node',
    children: [],
    data: [{
      key: 'message',
      value: 'Hello world, I was created ' + (new Date()).toLocaleDateString()
    }],
    ...o,
  });

  const [tree, setTree] = useState<TreeNode[]>([createNode({ name: 'Root node' })]);
 

  // Function to handle adding a new node
  const addNode = (parentId: string, newNode: TreeNode) => {
    setTree(prevTree => {
      const addNodeRecursive = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode]
            };
          }
          if (node.children) {
            return { ...node, children: addNodeRecursive(node.children) };
          }
          return node;
        });
      };
      return addNodeRecursive(prevTree);
    });
  };

  // Function to handle updating a node's key-value pairs
  const updateNodeData = (nodeId: string, newData: KeyValue[]) => {
    setTree(prevTree => {
      const updateNodeDataRecursive = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, data: newData };
          }
          if (node.children) {
            return { ...node, children: updateNodeDataRecursive(node.children) };
          }
          return node;
        });
      };
      return updateNodeDataRecursive(prevTree);
    });
  };

  // Function to handle deleting a node
  const deleteNode = (nodeId: string) => {
    setTree(prevTree => {
      const deleteNodeRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.filter(node => node.id !== nodeId)
          .map(node => ({
            ...node,
            children: node.children ? deleteNodeRecursive(node.children) : []
          }))
      );
      return deleteNodeRecursive(prevTree);
    });
  };

  const handleDataChange = (nodeId: string, key: string, value: string) => {
    setTree(prevTree => {
      const updateDataRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.map(node => {
          if (node.id === nodeId) {
            const updatedData = (node.data || []).map(d => d.key === key ? { ...d, value } : d);
            return { ...node, data: updatedData };
          }
          if (node.children) {
            return { ...node, children: updateDataRecursive(node.children) };
          }
          return node;
        })
      );
      return updateDataRecursive(prevTree);
    });
  };
  
  const [newKeyValue, setNewKeyValue] = useState<{ [nodeId: string]: KeyValue }>({});
  const addKeyValuePair = (nodeId: string) => {
    const newPair = newKeyValue[nodeId];
    if (newPair && newPair.key && newPair.value) {
      setTree(prevTree => {
        const addKeyValuePairRecursive = (nodes: TreeNode[]): TreeNode[] => (
          nodes.map(node => {
            if (node.id === nodeId) {
              const newData = [...(node.data || []), newPair];
              return { ...node, data: newData };
            }
            if (node.children) {
              return { ...node, children: addKeyValuePairRecursive(node.children) };
            }
            return node;
          })
        );
        return addKeyValuePairRecursive(prevTree);
      });
      // Reset the input fields for this node
      setNewKeyValue(prev => ({ ...prev, [nodeId]: { key: '', value: '' } }));
    }
  };

  const handleNewKeyValueChange = (nodeId: string, key: string, value: string) => {
    setNewKeyValue(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], [key]: value }
    }));
  };

  // Recursive function to render tree nodes
  const renderTree = (nodes: TreeNode[], parentId?: string) => (
    <ul>
      {nodes.map(node => (
        <li key={node.id} className="flex flex-col border">
          <details>
            <summary>

            {node.name}
            </summary>
          <div>
            {/* <button onClick={() => addNode(node.id, createNode({ name: 'New child' }))}>Add Child</button> */}
            <button onClick={() => node.name !== 'Root node' && deleteNode(node.id)}>Delete</button>
          </div>
          {node.data && node.data.map(({ key, value }) => (
            <div key={key}>
              {key}: <input className="text-black"type="text" value={value} onChange={e => handleDataChange(node.id, key, e.target.value)} />
            </div>
          ))}
           <div>
            <input 
              type="text" 
              placeholder="Key" 
              value={newKeyValue[node.id]?.key || ''} 
              onChange={e => handleNewKeyValueChange(node.id, 'key', e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Value" 
              value={newKeyValue[node.id]?.value || ''} 
              onChange={e => handleNewKeyValueChange(node.id, 'value', e.target.value)}
            />
            <button onClick={() => addKeyValuePair(node.id)}>
              Add Key-Value Pair
            </button>
          </div>
          {node.children && renderTree(node.children, node.id)}
          
          </details>
        </li>
      ))}
      {parentId && <button onClick={() => addNode(parentId, createNode({ name: 'New sibling' }))}>+ Node</button>}
    </ul>
  );

  return <div>{renderTree(tree)}</div>;
};

export default TreeStructure;