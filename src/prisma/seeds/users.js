const bcrypt = require('bcryptjs');

async function seedUsers(prisma) {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'user1@example.com',
      id: 'user-1',
      name: 'Test User 1',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user2@example.com',
      id: 'user-2',
      name: 'Test User 2',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user3@example.com',
      id: 'user-3',
      name: 'Test User 3',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user4@example.com',
      id: 'user-4',
      name: 'Test User 4',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user5@example.com',
      id: 'user-5',
      name: 'Test User 5',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user6@example.com',
      id: 'user-6',
      name: 'Test User 6',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user7@example.com',
      id: 'user-7',
      name: 'Test User 7',
      passwordHash,
      role: 'ADMIN',
    },
    {
      email: 'user8@example.com',
      id: 'user-8',
      name: 'Test User 8',
      passwordHash,
      role: 'CUSTOMER',
    },
    {
      email: 'user9@example.com',
      id: 'user-9',
      name: 'Test User 9',
      passwordHash,
      role: 'CUSTOMER',
    },
  ];

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log('Users seeded successfully!');
}

module.exports = seedUsers;
