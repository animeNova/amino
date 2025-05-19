/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get communities and their members
  const communities = await knex('community').select('id', 'name');
  
  // Get all users
  const users = await knex('user').select('id', 'name');
  
  const posts = [];
  const now = new Date();
  
  // Generate a random date within the last 6 months
  const randomDate = () => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toISOString();
  };
  
  // Sample post titles and content for variety
  const sampleTitles = [
    "Just joined this community!",
    "What do you think about...",
    "Looking for advice on...",
    "Check out my latest project",
    "Interesting article I found",
    "Question about a recent trend",
    "Sharing my experience with...",
    "Need help with a problem",
    "Discussion: Future of this field",
    "Weekly update on my progress"
  ];
  
  const sampleContent = [
    "I'm excited to be part of this community. Looking forward to learning and sharing with everyone!",
    "I've been working on this for a while and wanted to get your thoughts. What do you think?",
    "Has anyone had experience with this? I could use some advice on how to proceed.",
    "After months of work, I'm finally ready to share my project. Feedback welcome!",
    "I found this article really insightful and thought others might enjoy it too.",
    "I've noticed this trend recently and was wondering what others think about it.",
    "I wanted to share my experience with this in case it helps others in a similar situation.",
    "I've been struggling with this problem and could use some help from the community.",
    "Let's discuss where we think this field is headed in the next few years.",
    "Here's my weekly update on the progress I've made. Still a lot to do but making headway!"
  ];
  
  // For each community, get its members and create posts
  for (const community of communities) {
    // Get members of this community
    const members = await knex('members')
      .where('communityId', community.id)
      .select('user_Id');
    
    if (members.length === 0) continue;
    
    // Determine how many posts to create based on community name
    // This will create different activity levels, but with a maximum of 20 posts
    let postCount = 0;
    
    if (community.name === "Web Development") {
      postCount = 20; // Very active (was 120)
    } else if (community.name === "AI Enthusiasts") {
      postCount = 15; // Active (was 80)
    } else if (community.name === "PC Gaming") {
      postCount = 10; // Moderate (was 40)
    } else {
      postCount = Math.floor(Math.random() * 5) + 1; // Low (1-5 posts, was 1-10)
    }
    
    // Create posts
    for (let i = 0; i < postCount; i++) {
      // Pick a random member as the author
      const randomMemberIndex = Math.floor(Math.random() * members.length);
      const authorId = members[randomMemberIndex].user_Id;
      
      // Find the author's name for more realistic content
      const author = users.find(user => user.id === authorId);
      const authorName = author ? author.name : "Community Member";
      
      // Pick random title and content
      const titleIndex = Math.floor(Math.random() * sampleTitles.length);
      const contentIndex = Math.floor(Math.random() * sampleContent.length);
      
      // Create tags (0-3 random tags)
      const tagCount = Math.floor(Math.random() * 4);
      const tags = [];
      const possibleTags = ["discussion", "question", "help", "showcase", "news", "tutorial", "resource", "opinion"];
      
      for (let j = 0; j < tagCount; j++) {
        const tag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
      
      // Personalize content with author name occasionally
      let personalizedContent = sampleContent[contentIndex];
      if (Math.random() > 0.7) {
        personalizedContent = `Hi, I'm ${authorName}. ${personalizedContent}`;
      }
      
      // Add some longer content for variety
      if (Math.random() > 0.8) {
        personalizedContent += "\n\n" + sampleContent[Math.floor(Math.random() * sampleContent.length)];
      }
      
      // Create the post - use the tags array directly, not JSON.stringify
      posts.push({
        title: sampleTitles[titleIndex] + (i > 0 ? ` (${i})` : ''),
        content: personalizedContent,
        image: Math.random() > 0.7 ? `https://picsum.photos/seed/post${i}${community.id}/800/600` : null,
        tags: tags, // Changed from JSON.stringify(tags) to tags
        user_id: authorId,
        community_id: community.id,
        status: 'accepted',
        created_at: randomDate(),
        updated_at: randomDate()
      });
    }
  }
  
  // Insert posts in batches to avoid overwhelming the database
  const batchSize = 50;
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    await knex('posts').insert(batch);
  }
  
  console.log(`Seeded ${posts.length} posts across ${communities.length} communities`);
};
