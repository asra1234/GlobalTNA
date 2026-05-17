require('dotenv').config();
const mongoose = require('mongoose');

const JobRequest = require('../models/JobRequest');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/globaltna';

const SAMPLE_JOBS = [
  {
    title: 'Leaking kitchen tap needs repair',
    description: 'Kitchen mixer tap is dripping constantly and water is collecting under the sink cabinet.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Ahmed',
    contactEmail: 'sarah.ahmed@example.com',
    status: 'Open',
  },
  {
    title: 'Living room lighting installation',
    description: 'Need two pendant lights fitted and an old ceiling fixture removed safely.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'Daniel Ross',
    contactEmail: 'daniel.ross@example.com',
    status: 'Open',
  },
  {
    title: 'Bedroom repaint before move-in',
    description: 'Walls and skirting boards need fresh white paint before new tenants arrive next week.',
    category: 'Painting',
    location: 'Manchester',
    contactName: 'Aisha Khan',
    contactEmail: 'aisha.khan@example.com',
    status: 'In Progress',
  },
  {
    title: 'Custom hallway shelving',
    description: 'Looking for fitted wooden shelves in a narrow hallway alcove with a clean finish.',
    category: 'Joinery',
    location: 'Leeds',
    contactName: 'Tom Walker',
    contactEmail: 'tom.walker@example.com',
    status: 'Open',
  },
  {
    title: 'Garden gate hinge replacement',
    description: 'Side gate is sagging and the hinges are rusted through. Need replacement and alignment.',
    category: 'Other',
    location: 'Birmingham',
    contactName: 'Priya Patel',
    contactEmail: 'priya.patel@example.com',
    status: 'Closed',
  },
  {
    title: 'Bathroom extractor fan not working',
    description: 'Extractor fan stopped turning on and there is noticeable condensation after showers.',
    category: 'Electrical',
    location: 'Liverpool',
    contactName: 'Michael Green',
    contactEmail: 'michael.green@example.com',
    status: 'Open',
  },
  {
    title: 'Fence panel painting and touch-up',
    description: 'Back garden fence needs weatherproof paint and a few cracked sections touched up.',
    category: 'Painting',
    location: 'Bristol',
    contactName: 'Emma Lewis',
    contactEmail: 'emma.lewis@example.com',
    status: 'In Progress',
  },
  {
    title: 'Boiler cupboard door adjustment',
    description: 'Cupboard door around the boiler catches on the floor and needs trimming and rehanging.',
    category: 'Joinery',
    location: 'London',
    contactName: 'James Cooper',
    contactEmail: 'james.cooper@example.com',
    status: 'Open',
  },
];

async function seedJobs(options = {}) {
  const shouldReset = options.reset ?? process.argv.includes('--reset');
  const shouldManageConnection = options.manageConnection ?? true;

  if (shouldManageConnection) {
    await mongoose.connect(MONGO_URI);
  }

  if (shouldReset) {
    await JobRequest.deleteMany({});
    console.log('Existing jobRequests collection cleared.');
  }

  const operations = SAMPLE_JOBS.map((job) => ({
    updateOne: {
      filter: { title: job.title },
      update: { $set: job },
      upsert: true,
    },
  }));

  const result = await JobRequest.bulkWrite(operations);
  const totalJobs = await JobRequest.countDocuments();

  console.log(`Seed complete. Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}, Total jobs: ${totalJobs}`);

  return result;
}

module.exports = seedJobs;

if (require.main === module) {
  if (process.argv.includes('--help')) {
    console.log('Usage: npm run seed -- [--reset]');
    console.log('--reset  Clear existing jobs before inserting sample jobs.');
    process.exit(0);
  }

  seedJobs()
    .then(async () => {
      await mongoose.disconnect();
    })
    .catch(async (error) => {
      console.error('Failed to seed jobs:', error.message);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    });
}