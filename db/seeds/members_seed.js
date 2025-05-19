/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get the creator ID
  const creatorId = 'YSrEVvhpYiM010yur4aGx09salXm0DcV';
  
  // Get all communities
  const communities = await knex('community').select('id', 'name');
  
  // Get all users from the user table
  const users = await knex('user').select('id', 'name').where('role','!=','owner');

  
  // Create a batch of members for each community
  const members = [];
  
  // Function to get a random user ID from the users array
  const getRandomUserId = () => {
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex].id;
  };
  
  // Add creator as admin to all communities
  communities.forEach(community => {
    members.push({
      user_Id: creatorId,
      communityId: community.id,
      role: 'admin',
      approved_by: creatorId,
      joined_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Add different numbers of members to different communities to create variety
    // Web Development - large community
    if (community.name === "Web Development") {
      for (let i = 0; i < 150; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'member',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      // Add some moderators
      for (let i = 0; i < 5; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'moderator',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    // AI Enthusiasts - medium community
    else if (community.name === "AI Enthusiasts") {
      for (let i = 0; i < 75; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'member',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      // Add some moderators
      for (let i = 0; i < 3; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'moderator',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    // Add a few members to other communities
    else {
      const memberCount = Math.floor(Math.random() * 50) + 5; // 5-55 members
      for (let i = 0; i < memberCount; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'member',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Add 1-2 moderators
      const modCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < modCount; i++) {
        members.push({
          user_Id: getRandomUserId(),
          communityId: community.id,
          role: 'moderator',
          approved_by: creatorId,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
  });
  
  // Insert members in batches to avoid overwhelming the database
  const batchSize = 100;
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    await knex('members').insert(batch);
  }
  
  console.log(`Seeded ${members.length} members across ${communities.length} communities`);
};