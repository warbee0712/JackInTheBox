import { HierarchyService } from './HierarchyService';

const service = new HierarchyService();
const hid = service.createHierarchy();
console.log('Hierarchy ID:', hid);
