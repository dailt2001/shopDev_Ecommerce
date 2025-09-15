import { AccessControl } from "accesscontrol";

// let grantList = [
//     { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*' },
//     { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
//     { role: 'admin', resource: 'profile', action: 'delete:any', attributes: '*' },
//     { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' }
// ];
export const ac = new AccessControl();