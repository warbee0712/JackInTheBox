import { Node, NodeType, StoreNode } from './types';
import { v4 as uuidv4 } from 'uuid';

export class HierarchyService {
  private hierarchies: Map<string, Map<string, Node>> = new Map();

  createHierarchy(): string {
    const hierarchyId = uuidv4();
    const rootNode: Node = {
      id: uuidv4(),
      name: 'Jack in the Box',
      number: '000',
      type: 'root',
      children: [],
    };
    const nodeMap = new Map<string, Node>();
    nodeMap.set(rootNode.id, rootNode);
    this.hierarchies.set(hierarchyId, nodeMap);
    return hierarchyId;
  }

  getRootNodeId(hierarchyId: string): string {
    const nodeMap = this.hierarchies.get(hierarchyId);
    if (!nodeMap) throw new Error('Hierarchy not found');
    const root = Array.from(nodeMap.values()).find(node => node.type === 'root');
    if (!root) throw new Error('Root node not found');
    return root.id;
  }

  addNode(hierarchyId: string, parentId: string, nodeData: {
    name: string;
    number: string;
    type: NodeType;
    address?: string;
  }): string {
    const nodeMap = this.hierarchies.get(hierarchyId);
    if (!nodeMap) throw new Error('Hierarchy not found');

    const parent = nodeMap.get(parentId);
    if (!parent) throw new Error('Parent node not found');

    if (parent.type === 'store') {
      throw new Error('store cannot be added under store');
    }

    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      name: nodeData.name,
      number: nodeData.number,
      type: nodeData.type,
      parentId,
      children: [],
      ...(nodeData.type === 'store' ? { address: nodeData.address ?? '' } : {})
    } as Node;

    parent.children.push(newNodeId);
    nodeMap.set(newNodeId, newNode);
    return newNodeId;
  }

  listStores(hierarchyId: string, nodeId: string): StoreNode[] {
    const nodeMap = this.hierarchies.get(hierarchyId);
    if (!nodeMap) throw new Error('Hierarchy not found');
    const startNode = nodeMap.get(nodeId);
    if (!startNode) throw new Error('Node not found');

    const result: StoreNode[] = [];

    const dfs = (id: string) => {
      const node = nodeMap.get(id);
      if (!node) return;
      if (node.type === 'store') {
        result.push(node as StoreNode);
      }
      node.children.forEach(dfs);
    };

    dfs(nodeId);
    return result;
  }
}
