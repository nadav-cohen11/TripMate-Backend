import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import path from 'path';
import User from '../src/models/user.model.js';
import Trip from '../src/models/trip.model.js';
import Match from '../src/models/match.model.js';
import Review from '../src/models/review.model.js';
import logger from '../src/config/logger.js'

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const NUM_USERS = 80;
const NUM_TRIPS = 40;
const NUM_REVIEWS = 50;
const NUM_MATCHES = 30;

await mongoose.connect(process.env.MONGO_URI);
logger.info('✅ Connected to MongoDB');

async function clearCollections() {
  logger.info('\n🧹 Clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Review.deleteMany({}),
    Match.deleteMany({}),
  ]);
  logger.info('✅ Collections cleared.');
}

function getRandomEnum(enumArray) {
  return faker.helpers.arrayElement(enumArray);
}

function generateLocation() {
  return {
    type: 'Point',
    coordinates: [
      faker.location.longitude({ max: 0, min: -0.127758 }),
      faker.location.latitude({ max: 51.507351, min: 51 }),
    ],
    country: faker.location.country(),
    city: faker.location.city(),
  };
}

async function uploadRandomImageToCloudinary() {
  const imageUrl = faker.image.url();
  logger.info(`🖼️ Uploading random image: ${imageUrl}`);

  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: 'user-gallery',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    logger.info('✅ Image uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error('❌ Image upload failed:', err.message);
    return null;
  }
}
async function uploadRandomImageProfileToCloudinary() {
  const imageUrl = faker.image.url();
  logger.info(`🖼️ Uploading random image: ${imageUrl}`);

  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: 'user-profile',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    logger.info('✅ Image uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error('❌ Image upload failed:', err.message);
    return null;
  }
}

const sampleVideoPaths = [
  '/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/SampleVideos/SampleVideo_360x240_30mb.mp4',
  '/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/SampleVideos/SampleVideo_720x480_10mb.mp4',
];

async function uploadRandomVideoToCloudinary() {
  const localPath = faker.helpers.arrayElement(sampleVideoPaths);
  const fullPath = path.resolve(localPath);

  logger.info('\n🎞️ [Uploading Video]');
  logger.info('📍 Chosen file:', localPath);
  logger.info('📍 Resolved path:', fullPath);

  try {
    const result = await cloudinary.v2.uploader.upload(fullPath, {
      resource_type: 'video',
      folder: 'user-reels',
    });

    logger.info('✅ Upload success:', {
      url: result.secure_url,
      public_id: result.public_id,
      type: result.resource_type,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      type: result.resource_type,
    };
  } catch (err) {
    console.error('❌ Upload failed for video at:', fullPath);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Full error:', err);
    return null;
  }
}

async function uploadMultipleVideosToCloudinary() {
  const videos = [];
  const numVideos = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < numVideos; i++) {
    const uploaded = await uploadRandomVideoToCloudinary();
    if (uploaded) videos.push(uploaded);
  }

  return videos;
}

async function seedUsers() {
  logger.info('\n👤 Seeding users...');
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    logger.info(`\n--- Creating user ${i + 1} of ${NUM_USERS} ---`);
    const hashedPassword = await bcrypt.hash('123', 10);

    const photos = await Promise.all([
      uploadRandomImageToCloudinary(),
      uploadRandomImageToCloudinary(),
      uploadRandomImageToCloudinary(),
    ]);

    const filteredPhotos = photos
      .filter(Boolean)
      .map((url) => ({
        url,
        public_id: new URL(url).pathname.slice(1),
        type: 'image',
      }));
    const profilePhoto = await uploadRandomImageProfileToCloudinary();
    const afterUpload = profilePhoto?.split('/upload/')[1];

    const profilePhotoPath = afterUpload?.replace(/^v\d+\/+/, '');

    const reels = Math.random() < 0.5 ? await uploadMultipleVideosToCloudinary() : [];

    const user = new User({
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      birthDate: faker.date.between({ from: '1980-01-01', to: '2005-01-01' }),
      gender: getRandomEnum(['male', 'female']),
      languagesSpoken: faker.helpers.arrayElements(['english', 'spanish', 'french', 'german', 'hebrew'], 2),
      location: generateLocation(),
      adventureStyle: getRandomEnum(['Relaxed', 'Exploratory', 'Extreme', 'Photography']),
      bio: faker.lorem.sentence(),
      photos: filteredPhotos,
      profilePhotoId: profilePhotoPath,
      reels,
      socialLinks: {
        instagram: `https://instagram.com/${faker.internet.username()}`,
        facebook: `https://facebook.com/${faker.internet.username()}`,
      },
      travelPreferences: {
        destinations: [faker.location.country()],
        travelDates: {
          start: faker.date.future(),
          end: faker.date.future(),
        },
        groupSize: faker.number.int({ min: 1, max: 10 }),
        ageRange: { min: 20, max: 40 },
        interests: faker.helpers.arrayElements(['hiking', 'food', 'culture', 'beach', 'music'], 3),
        travelStyle: getRandomEnum(['budget', 'luxury', 'adventure', 'cultural', 'nature', 'social']),
      },
    });

    users.push(user);
  }

  const inserted = await User.insertMany(users);
  logger.info(`✅ Inserted ${inserted.length} users.`);
  return inserted;
}

async function seedTrips(users) {
  logger.info('\n🧳 Seeding trips...');
  const trips = [];

  for (let i = 0; i < NUM_TRIPS; i++) {
    const host = faker.helpers.arrayElement(users);

    trips.push(new Trip({
      host: host._id,
      destination: {
        country: faker.location.country(),
        city: faker.location.city(),
        location: generateLocation(),
      },
      travelDates: {
        start: faker.date.future(),
        end: faker.date.future(),
      },
      groupSize: faker.number.int({ min: 2, max: 8 }),
      description: faker.lorem.paragraph(),
      itinerary: [
        {
          day: 1,
          activities: [{
            time: '10:00 AM',
            title: 'City Tour',
            description: 'Visit the city center',
            location: faker.location.city(),
          }],
        },
      ],
      participants: users.slice(0, 3).map(u => ({
        userId: u._id,
        isConfirmed: faker.datatype.boolean(),
      })),
      tags: faker.helpers.arrayElements(['beach', 'hike', 'food', 'culture'], 3),
    }));
  }

  const inserted = await Trip.insertMany(trips);
  logger.info(`✅ Inserted ${inserted.length} trips.`);
  return inserted;
}

async function seedReviews(users, trips) {
  logger.info('\n✍️ Seeding reviews...');
  const reviews = [];

  for (let i = 0; i < NUM_REVIEWS; i++) {
    const reviewer = faker.helpers.arrayElement(users);
    let reviewee = faker.helpers.arrayElement(users);
    while (reviewee._id.equals(reviewer._id)) {
      reviewee = faker.helpers.arrayElement(users);
    }

    const trip = faker.helpers.arrayElement(trips);

    reviews.push(new Review({
      reviewerId: reviewer._id,
      revieweeId: reviewee._id,
      tripId: trip._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(2),
    }));
  }

  const inserted = await Review.insertMany(reviews);
  logger.info(`✅ Inserted ${inserted.length} reviews.`);
  return inserted;
}

async function seedMatches(users) {
  logger.info('\n💘 Seeding matches...');
  const matches = [];

  for (let i = 0; i < NUM_MATCHES; i++) {
    const user1 = faker.helpers.arrayElement(users);
    let user2 = faker.helpers.arrayElement(users);
    while (user2._id.equals(user1._id)) {
      user2 = faker.helpers.arrayElement(users);
    }

    matches.push(new Match({
      user1Id: user1._id,
      user2Id: user2._id,
      status: getRandomEnum(['pending', 'accepted', 'declined']),
      initiatedBy: faker.datatype.boolean() ? user1._id : user2._id,
      compatibilityScore: faker.number.int({ min: 50, max: 100 }),
      locationProximityScore: faker.number.int({ min: 0, max: 100 }),
      sharedInterestsScore: faker.number.int({ min: 0, max: 100 }),
      isBlocked: false,
    }));
  }

  const inserted = await Match.insertMany(matches);
  logger.info(`✅ Inserted ${inserted.length} matches.`);
  return inserted;
}

async function main() {
  try {
    await clearCollections();

    const users = await seedUsers();
    const trips = await seedTrips(users);
    await seedReviews(users, trips);
    await seedMatches(users);

    logger.info('\n🌱 All data seeded successfully.');
  } catch (err) {
    console.error('\n❌ Error in main seeding process:', err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

main();
