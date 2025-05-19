const { db } = require('../index');
const { NewCommunity } = require('../types');

async function seedCommunities() {
  console.log('Seeding communities...');
  
  const creatorId = 'YSrEVvhpYiM010yur4aGx09salXm0DcV';
  
  // First, check if we have genres to reference
  const genres = await db.selectFrom('genre').select(['id']).execute();
  
  if (genres.length === 0) {
    console.error('No genres found. Please seed genres first.');
    return;
  }
  
  // Sample communities data
  const communities: typeof  NewCommunity[] = [
    {
      name: 'Anime Enthusiasts',
      handle: 'anime-enthusiasts',
      description: 'A community for anime lovers to discuss their favorite shows, characters, and upcoming releases.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Manga Readers',
      handle: 'manga-readers',
      description: 'Discuss the latest manga chapters, share recommendations, and connect with fellow manga fans.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cosplay Central',
      handle: 'cosplay-central',
      description: 'Share your cosplay creations, get tips, and connect with other cosplayers.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1566204773863-cf63e6d4ab88?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Animation Techniques',
      handle: 'animation-techniques',
      description: 'A private community for animation professionals to discuss techniques and industry trends.',
      language: 'en',
      visibility: 'private',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Shonen Jump Fans',
      handle: 'shonen-jump',
      description: 'A community dedicated to discussing Weekly Shonen Jump manga series like One Piece, My Hero Academia, and more.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Anime Music Lovers',
      handle: 'anime-music',
      description: 'Share and discuss your favorite anime soundtracks, opening themes, and ending songs.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Mecha Anime',
      handle: 'mecha-anime',
      description: 'For fans of giant robots and mechanical designs in anime. Discuss classics like Gundam and modern mecha series.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1506901437675-cde80ff9c746?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Anime Conventions',
      handle: 'anime-cons',
      description: 'Share experiences, photos, and tips about anime conventions around the world.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1608889825205-eabe04a85fde?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Anime Art & Illustrations',
      handle: 'anime-art',
      description: 'A community for sharing and discussing anime-inspired artwork, illustrations, and digital art.',
      language: 'en',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=1000',
      created_by: creatorId,
      genre_id: genres[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Insert communities
  try {
    for (const community of communities) {
      // Check if community with this handle already exists
      const existingCommunity = await db
        .selectFrom('community')
        .where('handle', '=', community.handle)
        .select('id')
        .executeTakeFirst();
      
      if (!existingCommunity) {
        await db.insertInto('community').values(community).execute();
        console.log(`Created community: ${community.name}`);
      } else {
        console.log(`Community with handle ${community.handle} already exists, skipping.`);
      }
    }
    
    console.log('Communities seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding communities:', error);
  }
}

// Execute the seed function
seedCommunities()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed communities:', error);
    process.exit(1);
  });