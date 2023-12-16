'use client';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
interface KeyValue {
  key: string;
  value: any;
}

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data?: KeyValue[];
}

const TreeStructure: React.FC = () => {
  const createNode = (o = {}) => {
    return {
      id: uuidv4(),
      name: 'New node',
      children: [],
      data: [
        {
          key: 'message',
          value: 'Hello world, I was created '+(new Date()).toLocaleDateString()
        },
      ],
      ...o,
    }
  }
  const [tree, setTree] = useState<TreeNode[]>([
    createNode({
      name: 'Root node'
    })
  ]);
 

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
    // Logic to delete a node
  };

  // Recursive function to render tree nodes
  const renderTree = (nodes: TreeNode[], parentId?: string) => (
    <ul className="border">
      {nodes.map(node => (
        <li key={node.id} className="flex w-96 justify-between">
          {node.name}
          <button onClick={() => addNode(node.id, createNode({
            name: 'New child'
          }))}>Add Child</button>
          <button onClick={() => updateNodeData(node.id, node.data ? [...node.data, { key: 'message', value: 'edited'}] : [])}>Edit</button>
          <button onClick={() => deleteNode(node.id)}>Delete</button>
          {node.data ? node.data.map(({ key, value }) => <p>{key}: {value}</p>) : null}
          {node.children && renderTree(node.children, node.id)}
        </li>
      ))}
      {parentId && <button onClick={() => addNode(parentId, createNode({
        name: 'New sibling'
      }))}>Add Sibling</button>}
    </ul>
  );

  return <div>{renderTree(tree)}</div>;
};

export default TreeStructure;