/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries (optional - remove this if you want to keep existing users)
  // await knex('user').del()
  
  // Check if users already exist to avoid duplicates
  const existingUsers = await knex('user').select('email');
  const existingEmails = existingUsers.map(user => user.email);
  
  // Create sample users
  const users = [
    {
      email: 'admin@amino.app',
      name: 'Admin User',
      emailVerified: true,
      image: 'https://picsum.photos/seed/admin/200/200',
      role: 'admin',
      bio: 'Platform administrator for Amino. Here to help with any issues!',
      location: 'San Francisco, CA',
      website: 'https://amino.app',
      coverImage: 'https://picsum.photos/seed/admincover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'owner@amino.app',
      name: 'Platform Owner',
      emailVerified: true,
      image: 'https://picsum.photos/seed/owner/200/200',
      role: 'owner',
      bio: 'Founder and owner of Amino. Passionate about building communities!',
      location: 'New York, NY',
      website: 'https://amino.app/about',
      coverImage: 'https://picsum.photos/seed/ownercover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      emailVerified: true,
      image: 'https://picsum.photos/seed/sarah/200/200',
      role: 'user',
      bio: 'Web developer and design enthusiast. Love to share my projects and learn from others.',
      location: 'Seattle, WA',
      website: 'https://sarahjohnson.dev',
      coverImage: 'https://picsum.photos/seed/sarahcover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'michael@example.com',
      name: 'Michael Chen',
      emailVerified: true,
      image: 'https://picsum.photos/seed/michael/200/200',
      role: 'user',
      bio: 'Game developer and AI enthusiast. Currently working on an indie game project.',
      location: 'Austin, TX',
      website: 'https://michaelchen.games',
      coverImage: 'https://picsum.photos/seed/michaelcover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'alex@example.com',
      name: 'Alex Rodriguez',
      emailVerified: true,
      image: 'https://picsum.photos/seed/alex/200/200',
      role: 'user',
      bio: 'Digital artist and illustrator. I love creating and sharing my artwork with the community.',
      location: 'Los Angeles, CA',
      website: 'https://alexrodriguez.art',
      coverImage: 'https://picsum.photos/seed/alexcover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'priya@example.com',
      name: 'Priya Patel',
      emailVerified: true,
      image: 'https://picsum.photos/seed/priya/200/200',
      role: 'user',
      bio: 'Music producer and DJ. Sharing my latest tracks and looking for collaboration opportunities.',
      location: 'Chicago, IL',
      website: 'https://priyapatel.music',
      coverImage: 'https://picsum.photos/seed/priyacover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'james@example.com',
      name: 'James Wilson',
      emailVerified: true,
      image: 'https://picsum.photos/seed/james/200/200',
      role: 'user',
      bio: 'Book lover and aspiring author. I enjoy discussing literature and writing techniques.',
      location: 'Boston, MA',
      website: 'https://jameswilson.books',
      coverImage: 'https://picsum.photos/seed/jamescover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'emma@example.com',
      name: 'Emma Thompson',
      emailVerified: true,
      image: 'https://picsum.photos/seed/emma/200/200',
      role: 'user',
      bio: 'Astrophysicist and science communicator. Passionate about making space science accessible to everyone.',
      location: 'Houston, TX',
      website: 'https://emmathompson.space',
      coverImage: 'https://picsum.photos/seed/emmacover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'david@example.com',
      name: 'David Kim',
      emailVerified: true,
      image: 'https://picsum.photos/seed/david/200/200',
      role: 'user',
      bio: 'Fitness coach and nutrition expert. Sharing workout tips and healthy recipes.',
      location: 'Miami, FL',
      website: 'https://davidkim.fitness',
      coverImage: 'https://picsum.photos/seed/davidcover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'olivia@example.com',
      name: 'Olivia Martinez',
      emailVerified: true,
      image: 'https://picsum.photos/seed/olivia/200/200',
      role: 'user',
      bio: 'Chef and food blogger. I love experimenting with new recipes and food photography.',
      location: 'Portland, OR',
      website: 'https://oliviamartinez.food',
      coverImage: 'https://picsum.photos/seed/oliviacover/1200/300',
      is_new: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // New users who just joined
    {
      email: 'newuser1@example.com',
      name: 'Taylor Swift',
      emailVerified: true,
      image: 'https://picsum.photos/seed/taylor/200/200',
      role: 'user',
      bio: 'Just joined Amino! Looking forward to connecting with everyone.',
      location: 'Nashville, TN',
      is_new: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      email: 'newuser2@example.com',
      name: 'Jordan Lee',
      emailVerified: true,
      image: 'https://picsum.photos/seed/jordan/200/200',
      role: 'user',
      bio: 'New to the platform. Excited to explore all the communities!',
      is_new: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Filter out users that already exist
  const newUsers = users.filter(user => !existingEmails.includes(user.email));
  
  // Insert only new users
  if (newUsers.length > 0) {
    await knex('user').insert(newUsers);
    console.log(`Seeded ${newUsers.length} new users`);
  } else {
    console.log('No new users to seed');
  }
};
