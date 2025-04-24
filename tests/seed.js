import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import Trip from '../src/models/trip.model.js';
import Match from '../src/models/match.model.js';
import Chat from '../src/models/chat.model.js';
import Review from '../src/models/review.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return new Date(start + Math.random() * (end - start));
};

const generateRandomLocation = () => ({
  type: 'Point',
  coordinates: [1,1],
});

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await Promise.all([
      User.deleteMany(),
      Trip.deleteMany(),
      Match.deleteMany(),
      Chat.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log('🧹 Old data cleared');

    const travelStyles = ['budget', 'luxury', 'adventure', 'cultural'];
    const interestsList = ['hiking', 'culture', 'food', 'nightlife', 'beaches', 'history', 'photography'];

    const languages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko']; 
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = new User({
        fullName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        passwordHash: 'hashedpassword',
        birthDate: generateRandomDate('1990-01-01', '2004-01-01'),
        gender: randomItem(['male', 'female']),
        languagesSpoken: [randomItem(languages), randomItem(languages)],
        location: generateRandomLocation(),
        travelPreferences: {
          destinations: ['City A', 'City B'],
          travelDates: {
            start: generateRandomDate('2025-01-01', '2025-12-31'),
            end: generateRandomDate('2025-01-01', '2025-12-31'),
          },
          groupSize: generateRandomNumber(2, 10),
          ageRange: { min: 20, max: 40 },
          interests: [randomItem(interestsList), randomItem(interestsList), randomItem(interestsList)],
          travelStyle: randomItem(travelStyles),
        },
        adventureStyle: 'Relaxed',
        bio: 'A passionate traveler.',
        photos: ['https://randomuser.me/api/portraits/men/1.jpg'],
        socialLinks: {
          instagram: `https://instagram.com/user${i + 1}`,
        },
      });
      users.push(await user.save());
    }

    console.log(`Created ${users.length} users`);

    const trips = [];
    for (let i = 0; i < 20; i++) {
      const host = randomItem(users);
      const participantIds = users.filter(u => u._id !== host._id).slice(0, 4).map(u => ({
        userId: u._id,
        isConfirmed: Math.random() < 0.5,
      }));

      const trip = new Trip({
        host: host._id,
        destination: {
          country: 'Country A',
          city: 'City B',
          location: generateRandomLocation(),
        },
        travelDates: {
          start: generateRandomDate('2025-01-01', '2025-12-31'),
          end: generateRandomDate('2025-01-01', '2025-12-31'),
        },
        groupSize: 5,
        description: 'An exciting trip.',
        itinerary: Array.from({ length: 3 }, (_, i) => ({
          day: i + 1,
          activities: [
            {
              time: `${8 + i}:00`,
              title: 'Activity ' + (i + 1),
              description: 'An activity description.',
              location: 'Location A',
            },
          ],
        })),
        participants: participantIds,
        tags: [randomItem(interestsList), randomItem(interestsList), randomItem(interestsList)],
      });

      trips.push(await trip.save());
    }

    console.log(`Created ${trips.length} trips`);

    const reviews = [];
    for (let i = 0; i < 50; i++) {
      const reviewer = randomItem(users);
      let reviewee;
      do {
        reviewee = randomItem(users);
      } while (reviewer._id.equals(reviewee._id));

      const review = new Review({
        reviewerId: reviewer._id,
        revieweeId: reviewee._id,
        tripId: randomItem(trips)._id,
        rating: generateRandomNumber(1, 5),
        comment: 'A review comment.',
      });
      reviews.push(await review.save());
    }

    console.log(`Created ${reviews.length} reviews`);
    console.log('✅ Seed completed!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seed();
