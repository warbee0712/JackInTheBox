import { HierarchyService } from '../HierarchyService';

let service: HierarchyService;

beforeEach(() => {
  service = new HierarchyService();
});

test('Creating hierarchy returns a valid ID and root node is initialized', () => {
  const hid = service.createHierarchy();
  expect(hid).toBeDefined();

  const rootId = service.getRootNodeId(hid);
  expect(typeof rootId).toBe('string');
});

test('Add nested franchise > region > store and retrieve store correctly', () => {
  const hid = service.createHierarchy();
  const rootId = service.getRootNodeId(hid);

  const franchiseId = service.addNode(hid, rootId, {
    name: 'Franchise A',
    number: 'F001',
    type: 'franchise',
  });

  const regionId = service.addNode(hid, franchiseId, {
    name: 'Region 1',
    number: 'R001',
    type: 'region',
  });

  service.addNode(hid, regionId, {
    name: 'Store 1',
    number: '001',
    type: 'store',
    address: '123 Burger Lane',
  });

  service.addNode(hid, regionId, {
    name: 'Store 2',
    number: '002',
    type: 'store',
    address: '456 Fry Street',
  });

  const stores = service.listStores(hid, franchiseId);
  expect(stores.length).toBe(2);
});

test('Unbalanced tree returns deep store', () => {
  const hid = service.createHierarchy();
  const rootId = service.getRootNodeId(hid);

  let parentId = service.addNode(hid, rootId, {
    name: 'Franchise Z',
    number: 'FZ',
    type: 'franchise',
  });

  for (let i = 0; i < 5; i++) {
    parentId = service.addNode(hid, parentId, {
      name: `Region ${i}`,
      number: `R${i}`,
      type: 'region',
    });
  }

  service.addNode(hid, parentId, {
    name: 'Deep Store',
    number: '999',
    type: 'store',
    address: '999 Depth Road',
  });

  const stores = service.listStores(hid, rootId);
  expect(stores.length).toBe(1);
  expect(stores[0].name).toBe('Deep Store');
});

test('Invalid hierarchy or node access throws error', () => {
  expect(() => service.addNode('bad-id', 'parent', {
    name: 'Test',
    number: '001',
    type: 'region'
  })).toThrow('Hierarchy not found');

  const hid = service.createHierarchy();
  expect(() => service.addNode(hid, 'bad-parent', {
    name: 'Oops',
    number: '002',
    type: 'store',
    address: 'nowhere',
  })).toThrow('Parent node not found');

  expect(() => service.listStores('bad-id', 'any')).toThrow('Hierarchy not found');
});

test('Prevents store under store', () => {
  const hid = service.createHierarchy();
  const rootId = service.getRootNodeId(hid);

  const franchiseId = service.addNode(hid, rootId, {
    name: 'Franchise Y',
    number: 'FY',
    type: 'franchise',
  });

  const regionId = service.addNode(hid, franchiseId, {
    name: 'Region Y',
    number: 'RY',
    type: 'region',
  });

  const storeId = service.addNode(hid, regionId, {
    name: 'Main Store',
    number: 'S1',
    type: 'store',
    address: '123 Main St',
  });

  expect(() => service.addNode(hid, storeId, {
    name: 'Sub Store',
    number: 'S2',
    type: 'store',
    address: 'Back alley',
  })).toThrow('store cannot be added under store');
});
