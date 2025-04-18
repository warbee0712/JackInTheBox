export type NodeType = 'root' | 'franchise' | 'region' | 'store';

export interface BaseNode {
  id: string;
  name: string;
  number: string;
  type: NodeType;
  parentId?: string;
  children: string[];
}

export interface StoreNode extends BaseNode {
  type: 'store';
  address: string;
}

export type Node = BaseNode | StoreNode;
