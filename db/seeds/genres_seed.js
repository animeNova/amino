/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const creatorId = 'YSrEVvhpYiM010yur4aGx09salXm0DcV';

  await knex('genre').insert([
    {
      name: "Technology",
      description: "Communities focused on technology, programming, and digital innovation",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Gaming",
      description: "Communities for video games, board games, and gaming culture",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Art & Design",
      description: "Communities for artists, designers, and creative professionals",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Music",
      description: "Communities for music lovers, musicians, and industry professionals",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Books & Literature",
      description: "Communities for book lovers, writers, and literary discussions",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Science",
      description: "Communities focused on scientific research, discoveries, and education",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Health & Fitness",
      description: "Communities for health, fitness, and wellness enthusiasts",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Food & Cooking",
      description: "Communities for food lovers, chefs, and cooking enthusiasts",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Travel",
      description: "Communities for travelers, adventurers, and travel planning",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Sports",
      description: "Communities for sports fans, athletes, and sports discussions",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Finance",
      description: "Communities focused on personal finance, investing, and economics",
      created_by: creatorId,
      created_at: new Date().toISOString()
    },
    {
      name: "Education",
      description: "Communities for students, teachers, and educational content",
      created_by: creatorId,
      created_at: new Date().toISOString()
    }
  ]);
};
