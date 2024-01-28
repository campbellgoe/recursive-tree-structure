'use client';
import { useHasMounted } from '@/utils/useHasMounted';
import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "../tailwind.output.css";
interface KeyValue {
  key: string;
  value: string;
  type: string;
}

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  props?: KeyValue[];
  tagName?: string;
}

export interface MyElement {
  id: string;
}

interface TreeElement extends MyElement {
  tree: any;
  setTree: any;
  createNode: any;
}

const allowedTagNames = ['Fragment', 'button', 'main', 'div', 'span', 'p', 'section', 'aside', , 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];


const TreeStructure: React.FC<TreeElement> = ({ id = uuidv4(), tree, setTree, createNode }) => {
  const addNode = useCallback((parentId: string, newNode: TreeNode) => {
    setTree((prevTree: TreeNode[]) => {
      // Logic to add a new node
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
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    const confirmed = confirm('Confirm delete')
    if (confirmed) {
      setTree((prevTree: TreeNode[]) => {
        // Logic to delete a node
        const deleteNodeRecursive = (nodes: TreeNode[]): TreeNode[] => (
          nodes.filter(node => node.id !== nodeId)
            .map(node => ({
              ...node,
              children: node.children ? deleteNodeRecursive(node.children) : []
            }))
        );
        return deleteNodeRecursive(prevTree);
      });
    } else {
      console.log('cancelled deletion.')
    }
  }, []);

  const deleteKeyValuePair = (nodeId: string, key: string) => {
    const confirmed = confirm('Confirm delete')
    if (confirmed) {
      setTree((prevTree: TreeNode[]) => {
        const deleteKeyValuePairRecursive = (nodes: TreeNode[]): TreeNode[] => (
          nodes.map(node => {
            if (node.id === nodeId) {
              const newData = (node.props || []).filter(d => d.key !== key);
              return { ...node, props: newData };
            }
            if (node.children) {
              return { ...node, children: deleteKeyValuePairRecursive(node.children) };
            }
            return node;
          })
        );
        return deleteKeyValuePairRecursive(prevTree);
      });
    } else {
      console.log('cancelled deletion.')
    }
  };

  const handlePropsChange = useCallback((nodeId: string, key: string, value: string) => {
    // Logic to handle props change
    setTree((prevTree: TreeNode[]) => {
      const updateDataRecursive = (nodes: TreeNode[]): TreeNode[] => (
        nodes.map(node => {
          if (node.id === nodeId) {
            const updatedData = (node.props || []).map(d => d.key === key ? { ...d, value } : d);
            return { ...node, props: updatedData };
          }
          if (node.children) {
            return { ...node, children: updateDataRecursive(node.children) };
          }
          return node;
        })
      );
      return updateDataRecursive(prevTree);
    });
  }, []);

  const [newKeyValue, setNewKeyValue] = useState<{ [nodeId: string]: KeyValue }>({});
  const addKeyValuePair = (nodeId: string) => {
    const newPair = newKeyValue[nodeId];
    if (newPair && newPair.key && newPair.value) {
      setTree((prevTree: TreeNode[]) => {
        const addKeyValuePairRecursive = (nodes: TreeNode[]): TreeNode[] => (
          nodes.map(node => {
            if (node.id === nodeId) {
              const newData = [...(node.props || []), newPair];
              return { ...node, props: newData };
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
      setNewKeyValue(prev => ({ ...prev, [nodeId]: { key: '', value: '', type: 'string' } }));
    }
  };

  const handleNewKeyValueChange = (nodeId: string, key: string, value: string) => {
    setNewKeyValue(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], [key]: value }
    }));
  };

  const handleNameChange = (nodeId: string, newName: string) => {
    setTree((prevTree: TreeNode[]) => {
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
    setTree((prevTree: TreeNode[]) => {
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
          const props = (node.props || []).reduce((acc: any, { key, value, type }) => {
            let outputValue = value
            if((value.startsWith('{{') && value.endsWith('}}'))){
              // WARN: eval is dangerous, warn the user not to enter unknown code into this
              outputValue = eval(value.slice(2, -2))
            }
            acc[key] = outputValue;
            return acc;
          }, {});

          return (
            <Component key={node.id} {...props}>
              {node.children && renderTreeAsJsx(node.children, node.id)}
              {props?.children}
            </Component>
          );
        })}
      </>
    );
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
    setTree((currentTree: TreeNode[]) => {
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
                {node.name.length > 30 ? node.name.slice(0, 29) + "..." : node.name}
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
              {node.props && node.props.map(({ key, value }) => (
                <div key={key}>
                  {key}: <textarea className="resize text-black" value={value} onChange={e => handlePropsChange(node.id, key, e.target.value)} />
                  <button onClick={() => deleteKeyValuePair(node.id, key)}>Delete</button>
                </div>
              ))}
              <details>
                <summary>Edit props</summary>
                <div>
                  <input
                    type="text"
                    placeholder="Key"
                    value={newKeyValue[node.id]?.key || ''}
                    onChange={e => handleNewKeyValueChange(node.id, 'key', e.target.value)}
                  />
                  <textarea
                    className="resize"
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