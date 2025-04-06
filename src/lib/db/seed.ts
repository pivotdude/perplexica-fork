import db from './index';
import { roles } from './schema';

async function seedRoles() {
  await db.insert(roles).values([
    { name: 'admin', description: 'Administrator role' },
    { name: 'user', description: 'Regular user role' },
    { name: 'not_confirmed', description: 'User who hasn\'t confirmed their email' },
  ]).onConflictDoNothing();
}

seedRoles()
  .then(() => console.log('Roles seeded successfully'))
  .catch((err) => console.error('Error seeding roles:', err));