/* eslint-disable */

import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import 'colors';

import User from '../../models/user.model.js';
import Gig from '../../models/gig.model.js';
import Review from '../../models/review.model.js';

import connectDB from '../../config/db.js';

dotenv.config({ path: './variable.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const users = JSON.stringify(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
);
const gigs = JSON.stringify(fs.readFileSync(`${__dirname}/gigs.json`, 'utf-8'));
const reviews = JSON.stringify(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await User.create({ validateBeforeSave: false }, users);
    await Gig.create(gigs);
    await Review.create(reviews);

    console.log(
      '👍👍👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍👍👍'.cyan.bold,
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    console.log('😢😢 Goodbye Data...');

    await User.deleteMany();
    await Gig.deleteMany();
    await Review.deleteMany();

    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
        .blue.bold,
    );
    process.exit();
  } catch (err) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold,
    );
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else {
  deleteData();
}
