'use client';
import { useHasMounted } from '@/utils/useHasMounted';
import React, { useEffect, useState } from 'react';
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
  tagName?: string;
}

type TreeStructureProps = {
  id: string;
}

const TreeStructure: any = ({ id = '' }: TreeStructureProps) => {
  const allowedTagNames = ['div', 'span', 'p', 'section', 'Fragment', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'style'];
  const createNode = (o = {}) => ({
    id: uuidv4(),
    name: 'New node',
    children: [],
    data: [],
    tagName: 'div',
    ...o,
  });

  const [tree, setTree] = useState<TreeNode[]>(() => {
    if (typeof window != 'undefined') {
      const savedTreeData = localStorage.getItem('treeData' + id);
      try {
        return savedTreeData ? JSON.parse(savedTreeData) : [createNode({ name: 'Root node', tagName: 'Fragment' })];
      } catch (err) {
        console.error(err)
      }
    }
    return [createNode({ name: 'Root node', type: 'Fragment' })]
  });
  useEffect(() => {
    if (typeof window != 'undefined') {
      localStorage.setItem('treeData' + id, JSON.stringify(tree));
      if (tree.length === 0) {
        setTree([createNode({ name: 'Root node', type: 'Fragment' })])
      }
    }
  }, [tree]);

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

  const handleNameChange = (nodeId: string, newName: string) => {
    setTree(prevTree => {
      const updateNameRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, name: newName };
          }
          if (node.children) {
            return { ...node, children: updateNameRecursive(node.children) };
          }
          return node;
        })
      );
      return updateNameRecursive(prevTree);
    });
  };

  const handleTagNameChange = (nodeId: string, newTagName: string) => {
    setTree(prevTree => {
      const updateTagNameRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, tagName: newTagName };
          }
          if (node.children) {
            return { ...node, children: updateTagNameRecursive(node.children) };
          }
          return node;
        })
      );
      return updateTagNameRecursive(prevTree);
    });
  };

  const renderTreeAsJsx = (nodes: TreeNode[], parentId?: string) => {
    return (
      <>
        {nodes.map(node => {
          const Component = node.tagName === 'Fragment' ? React.Fragment : node.tagName || 'div';
          const props = (node.data || []).reduce((acc: any, { key, value }) => {
            acc[key] = value;
            return acc;
          }, {});

          return (
            <Component key={node.id} {...props}>
              {node.name}
              {node.children && renderTreeAsJsx(node.children, node.id)}
            </Component>
          );
        })}
      </>
    );
  };

  const deleteKeyValuePair = (nodeId: string, key: string) => {
    setTree(prevTree => {
      const deleteKeyValuePairRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.map(node => {
          if (node.id === nodeId) {
            const newData = (node.data || []).filter(d => d.key !== key);
            return { ...node, data: newData };
          }
          if (node.children) {
            return { ...node, children: deleteKeyValuePairRecursive(node.children) };
          }
          return node;
        })
      );
      return deleteKeyValuePairRecursive(prevTree);
    });
  };

  // Helper function to find a node and its parent in the tree
  const findNodeAndParent = (nodes: TreeNode[], nodeId: string, parent = null): any => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        return { node: nodes[i], parent, index: i };
      }
      if (nodes[i].children) {
        // @ts-ignore
        const result = findNodeAndParent(nodes[i].children, nodeId, nodes[i]);
        if (result) return result;
      }
    }
  };
  // Function to move a node either up or down in the tree
  const moveNode = (nodeId: string, direction: string) => {
    setTree(currentTree => {
      let newTree = JSON.parse(JSON.stringify(currentTree)); // Deep copy of the tree
      const { node, parent, index } = findNodeAndParent(newTree, nodeId);

      if (!parent) {
        // If no parent is found, we are at the root level
        return currentTree; // Do nothing if the node is at the root level
      }

      let newIndex = direction === 'up' ? index - 1 : index + 1;

      // Check if the new index is within valid range
      if (newIndex >= 0 && newIndex < parent.children.length) {
        // Swap the nodes
        [parent.children[index], parent.children[newIndex]] = [parent.children[newIndex], parent.children[index]];
      }

      return newTree;
    });
  };


  // Recursive function to render tree nodes
  const renderEditableTree = (nodes: TreeNode[], parentId?: string) => (
    <>
      {nodes.map(node => {

        return (
          <div key={node.id} className={"flex flex-col border"} style={{ marginLeft: '2ch' }}>
            <details>
              <summary>
                {node.name}
                <div>
                  <button onClick={() => moveNode(node.id, 'up')}>&uarr;</button>
                  <button onClick={() => moveNode(node.id, 'down')}>&darr;</button>
                </div>
              </summary>
              <div>
                <input
                  type="text"
                  value={node.name}
                  onChange={(e) => handleNameChange(node.id, e.target.value)}
                  className="outline-none"
                />
                <select
                  value={node.tagName || 'Fragment'}
                  onChange={(e) => handleTagNameChange(node.id, e.target.value)}
                  className="outline-none"
                >
                  {allowedTagNames.map(tagName => (
                    <option key={tagName} value={tagName}>{tagName}</option>
                  ))}
                </select>
                {/* <button onClick={() => addNode(node.id, createNode({ name: 'New child' }))}>Add Child</button> */}
                <button onClick={() => deleteNode(node.id)}>Delete</button>

              </div>
              {node.data && node.data.map(({ key, value }) => (
                <div key={key}>
                  {key}: <input className="text-black" type="text" value={value} onChange={e => handleDataChange(node.id, key, e.target.value)} />
                  <button onClick={() => deleteKeyValuePair(node.id, key)}>Delete</button>
                </div>
              ))}
              <details>
                <summary>Edit k/vs</summary>
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
              </details>
              {node.children && renderEditableTree(node.children, node.id)}

            </details>
          </div>
        )
      })}
      {parentId && <button onClick={() => addNode(parentId, createNode({ name: 'New sibling' }))}>+ Node</button>}
    </>
  );
  const mounted = useHasMounted()
  return mounted ? (<div><section>
    {renderEditableTree(tree)}
  </section>
    <br />
    <section>
      {renderTreeAsJsx(tree)}
    </section>
  </div>) : (<div>Loading...</div>)
};

export default TreeStructure;