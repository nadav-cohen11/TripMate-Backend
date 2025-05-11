import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import Trip from '../src/models/trip.model.js';
import Match from '../src/models/match.model.js';
import Review from '../src/models/review.model.js';
import bcrypt from 'bcrypt'

dotenv.config();

const NUM_USERS = 100;
const NUM_TRIPS = 100;
const NUM_REVIEWS = 100;
const NUM_MATCHES = 1000;

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to DB');

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Review.deleteMany({}),
    Match.deleteMany({}),
  ]);
  console.log('Cleared collections');
}

function getRandomEnum(enumArray) {
  return faker.helpers.arrayElement(enumArray);
}

function generateLocation() {
  return {
    type: 'Point',
    coordinates: [
      faker.location.longitude(), 
      faker.location.latitude()
    ],    
  };
}

async function seedUsers() {
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const hashedPassword = await bcrypt.hash('123', 10);
    users.push(new User({
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      birthDate: faker.date.between({ from: '1980-01-01', to: '2005-01-01' }),
      gender: getRandomEnum(['male', 'female']),
      languagesSpoken: faker.helpers.arrayElements(['english', 'spanish', 'french', 'german', 'hebrew'], 2),
      location: generateLocation(),
      adventureStyle: getRandomEnum(['Relaxed', 'Exploratory', 'Extreme', 'Photography']),
      bio: faker.lorem.sentence(),
      photos: Array.from({ length: 3 }, () => faker.image.avatar()),
      socialLinks: {
        instagram: `https://instagram.com/${faker.internet.username()}`,
        facebook: `https://facebook.com/${faker.internet.username()}`
      },
      travelPreferences: {
        destinations: [faker.location.country()],
        travelDates: {
          start: faker.date.future(),
          end: faker.date.future(),
        },
        groupSize: faker.number.int({ min: 1, max: 10 }),
        ageRange: {
          min: 20,
          max: 40,
        },
        interests: faker.helpers.arrayElements(['hiking', 'food', 'culture', 'beach', 'music'], 3),
        travelStyle: getRandomEnum(['budget', 'luxury', 'adventure', 'cultural', 'nature', 'social']),
      }
    }));
  }

  return User.insertMany(users);
}

async function seedTrips(users) {
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
      participants: users.slice(0, 3).map((u) => ({
        userId: u._id,
        isConfirmed: faker.datatype.boolean(),
      })),
      tags: faker.helpers.arrayElements(['beach', 'hike', 'food', 'culture'], 3),
    }));
  }

  return Trip.insertMany(trips);
}

async function seedReviews(users, trips) {
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

  return Review.insertMany(reviews);
}

async function seedMatches(users, trips) {
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

  return Match.insertMany(matches);
}

async function main() {
  await clearCollections();

  const users = await seedUsers();
  const trips = await seedTrips(users);
  await seedReviews(users, trips);
  await seedMatches(users, trips);

  console.log('Seed completed.');
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
