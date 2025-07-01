import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import fs from 'fs';
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

const NUM_USERS = 60;
const NUM_TRIPS = 1;
const NUM_REVIEWS = 50;
const NUM_MATCHES = 1;

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

let latCounter = 0;
let lonCounter = 0;
34.79766117754824
function getRandomPointInIsraeliBox() {
  const centerLat = 34.79766117754824;
  const centerLon = 31.96516656696053;

  const smallStep = 1e-2; 

  const lat = centerLat + (latCounter++ * smallStep);
  const lon = centerLon + (lonCounter++ * smallStep);

  return {
    type: 'Point',
    coordinates: [lon, lat],
    country: 'Israel',
    city: faker.helpers.arrayElement([
      'Rishon LeZion', 'Ness Ziona', 'Rehovot', 'Yavne', 'Holon'
    ]),
  };
}


async function uploadRandomImageToCloudinary(userGender) {
  const localImages = getLocalProfileImagesPaths(userGender);

  const localImagePath = faker.helpers.arrayElement(localImages);
  logger.info(`🖼️ Uploading local image for ${localImagePath}`);

  try {
    const result = await cloudinary.v2.uploader.upload(localImagePath, {
      folder: 'user-gallery',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    logger.info('✅ Image uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    logger.error('❌ Upload failed:', err.message);
    return null;
  }
}

async function uploadRandomImageNatureToCloudinary() {
  const localImages = getLocalNatureImagesPaths()

  const localImagePath = faker.helpers.arrayElement(localImages);
  logger.info(`🖼️ Uploading local image for nature: ${localImagePath}`);

  try {
    const result = await cloudinary.v2.uploader.upload(localImagePath, {
      folder: 'user-gallery',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    logger.info('✅ Image uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    logger.error('❌ Upload failed:', err.message);
    return null;
  }
}

function getLocalProfileImagesPaths(gender) {
  const folderPath = path.resolve(
    `/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/ProfileImage${gender === 'male' ? 'Men' : 'Women'}`
  );

  const files = fs.readdirSync(folderPath);
  const images = files
    .filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join(folderPath, file));

  return images;
}

function getLocalNatureImagesPaths() {
  const folderPath = path.resolve(
    '/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/NatureImages'
  );
  const files = fs.readdirSync(folderPath);
  const images = files
    .filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join(folderPath, file));

  return images;
}

async function uploadLocalProfileImageToCloudinary(userGender) {
  const localImages = getLocalProfileImagesPaths(userGender);

  const localImagePath = faker.helpers.arrayElement(localImages);
  logger.info(`🖼️ Uploading local profile image for ${userGender}: ${localImagePath}`);

  try {
    const result = await cloudinary.v2.uploader.upload(localImagePath, {
      folder: 'user-profile',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    logger.info('✅ Image uploaded:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    logger.error('❌ Image upload failed:', err.message);
    return null;
  }
}

function getSampleVideoPaths() {
  const folderPath = '/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/SampleVideos';

  const files = fs.readdirSync(folderPath);

  const videoPaths = files
    .filter(file => path.extname(file).toLowerCase() === '.mp4')
    .map(file => path.join(folderPath, file));

  return videoPaths;
}

const sampleVideoPaths = getSampleVideoPaths();

function getSampleImagesPaths() {
  const folderPath = '/Users/nadavcohen/DevProject2025/TripMate_Backend/TripMate-Backend/tests/SampleImages';

  const files = fs.readdirSync(folderPath);

  const imagesPaths = files
    .filter(file => path.extname(file).toLowerCase() === '.jpg')
    .map(file => path.join(folderPath, file));

  return imagesPaths;
}

const sampleImagesPaths = getSampleImagesPaths();

async function uploadRandomImageFromLocalToCloudinary() {
  const localPath = faker.helpers.arrayElement(sampleImagesPaths);
  const fullPath = path.resolve(localPath);

  logger.info('\n🖼️ [Uploading Image]');
  logger.info('📍 Chosen file:', localPath);
  logger.info('📍 Resolved path:', fullPath);

  try {
    const result = await cloudinary.v2.uploader.upload(fullPath, {
      resource_type: 'image',
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
    logger.error('❌ Upload failed for image at:', fullPath, err);
    return null;
  }
}

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
    logger.error('❌ Upload failed for video at:', fullPath, err);
    return null;
  }
}

async function uploadMultipleMediaToUserReels() {
  const media = [];
  const numItems = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < numItems; i++) {
    const isVideo = Math.random() < 0.5;
    let uploaded;

    if (isVideo) {
      uploaded = await uploadRandomVideoToCloudinary();
    } else {
      uploaded = await uploadRandomImageFromLocalToCloudinary();
    }

    if (uploaded) media.push(uploaded);
  }

  return media;
}

async function uploadMultipleImagesToCloudinary() {
  const images = [];
  const numImages = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < numImages; i++) {
    const uploaded = await uploadRandomImageFromLocalToCloudinary();
    if (uploaded) images.push(uploaded);
  }

  return images;
}

async function seedUsers() {
  logger.info('\n👤 Seeding users...');
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    logger.info(`\n--- Creating user ${i + 1} of ${NUM_USERS} ---`);
    const hashedPassword = await bcrypt.hash('123', 10);
    const userGender = getRandomEnum(['male', 'female']); 

    const photosRaw = await Promise.all([
      uploadRandomImageToCloudinary(userGender),
      uploadRandomImageNatureToCloudinary(),
      uploadRandomImageNatureToCloudinary(),
    ]);

    const photos = photosRaw
      .filter(Boolean)
      .map((url) => ({
        url,
        public_id: new URL(url).pathname.slice(1),
        type: 'image',
      }));
    const profilePhotoUrl = await uploadLocalProfileImageToCloudinary(userGender);
    const afterUpload = profilePhotoUrl?.split('/upload/')[1];
    const profilePhotoPath = afterUpload?.replace(/^v\d+\/+/, '');

    const reels = await uploadMultipleMediaToUserReels();

    const user = new User({
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      birthDate: faker.date.between({ from: '1980-01-01', to: '2005-01-01' }),
      gender: userGender,
      languagesSpoken: faker.helpers.arrayElements(['english', 'spanish', 'french', 'german', 'hebrew'], 2),
      location: getRandomPointInIsraeliBox(),
      adventureStyle: getRandomEnum(['Relaxed', 'Exploratory', 'Extreme', 'Photography']),
      bio: faker.lorem.sentence(),
      photos,
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
        location: getRandomPointInIsraeliBox(),
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
