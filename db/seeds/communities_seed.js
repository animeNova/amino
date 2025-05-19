/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Get the creator ID used in genres
  const creatorId = 'YSrEVvhpYiM010yur4aGx09salXm0DcV';
  
  // Get all genre IDs to reference them
  const genres = await knex('genre').select('id', 'name');
  
  // Create a map of genre names to IDs for easy lookup
  const genreMap = {};
  genres.forEach(genre => {
    genreMap[genre.name] = genre.id;
  });
  
  // Define communities with various activity levels and sizes
  const communities = [
    // Technology communities
    {
      name: "Web Development",
      handle: "webdev",
      description: "A community for web developers to share knowledge, ask questions, and discuss the latest trends in web development.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/webdev/300/300",
      banner: "https://picsum.photos/seed/webdevbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Technology"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: "AI Enthusiasts",
      handle: "ai-enthusiasts",
      description: "Discuss artificial intelligence, machine learning, and the future of technology.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/ai/300/300",
      banner: "https://picsum.photos/seed/aibanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Technology"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Gaming communities
    {
      name: "PC Gaming",
      handle: "pcgaming",
      description: "A community for PC gamers to discuss hardware, games, and share gaming experiences.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/pcgaming/300/300",
      banner: "https://picsum.photos/seed/pcgamingbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Gaming"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: "Indie Game Developers",
      handle: "indiedev",
      description: "A space for indie game developers to share their projects, get feedback, and collaborate.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/indiedev/300/300",
      banner: "https://picsum.photos/seed/indiedevbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Gaming"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Art & Design communities
    {
      name: "Digital Artists",
      handle: "digital-art",
      description: "Share your digital artwork, get feedback, and discuss techniques and tools.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/digitalart/300/300",
      banner: "https://picsum.photos/seed/digitalartbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Art & Design"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Music communities
    {
      name: "Music Producers",
      handle: "music-producers",
      description: "A community for music producers to share their work, discuss production techniques, and collaborate.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/musicprod/300/300",
      banner: "https://picsum.photos/seed/musicprodbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Music"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Books & Literature communities
    {
      name: "Book Club",
      handle: "bookclub",
      description: "Discuss books, share recommendations, and participate in monthly reading challenges.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/bookclub/300/300",
      banner: "https://picsum.photos/seed/bookbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Books & Literature"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Science communities
    {
      name: "Space Exploration",
      handle: "space",
      description: "Discuss space exploration, astronomy, and the latest discoveries in space science.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/space/300/300",
      banner: "https://picsum.photos/seed/spacebanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Science"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Health & Fitness communities
    {
      name: "Fitness Journey",
      handle: "fitness",
      description: "Share your fitness journey, workout routines, and nutrition tips.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/fitness/300/300",
      banner: "https://picsum.photos/seed/fitnessbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Health & Fitness"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Food & Cooking communities
    {
      name: "Home Chefs",
      handle: "homechefs",
      description: "Share recipes, cooking tips, and food photography.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/cooking/300/300",
      banner: "https://picsum.photos/seed/cookingbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Food & Cooking"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Travel communities
    {
      name: "Budget Travelers",
      handle: "budget-travel",
      description: "Tips and stories for traveling on a budget.",
      language: "en",
      visibility: "public",
      image: "https://picsum.photos/seed/travel/300/300",
      banner: "https://picsum.photos/seed/travelbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Travel"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    
    // Private community example
    {
      name: "Exclusive Tech",
      handle: "exclusive-tech",
      description: "A private community for discussing cutting-edge technology.",
      language: "en",
      visibility: "private",
      image: "https://picsum.photos/seed/privatetech/300/300",
      banner: "https://picsum.photos/seed/privatetechbanner/1200/300",
      created_by: creatorId,
      genre_id: genreMap["Technology"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Insert communities
  await knex('community').insert(communities);
  
  console.log(`Seeded ${communities.length} communities`);
};