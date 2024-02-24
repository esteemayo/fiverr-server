import slugify from 'slugify';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const gigSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A gig must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'A gig must have a title'],
    },
    slug: {
      type: String,
    },
    desc: {
      type: String,
      required: [true, 'A gig must have a description'],
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'A gig must belong to a category'],
    },
    price: {
      type: Number,
      required: [true, 'A gig must have a price'],
    },
    cover: {
      type: String,
      required: [true, 'A gig must have a cover image'],
    },
    images: {
      type: [String],
    },
    shortTitle: {
      type: String,
      required: [true, 'A gig must have a short title'],
    },
    shortDesc: {
      type: String,
      required: [true, 'A gig must have a short description'],
    },
    deliveryTime: {
      type: Number,
      required: [true, 'A gig must have a delivery time'],
    },
    revisionNumber: {
      type: Number,
      required: [true, 'A gig must have a revision number'],
    },
    features: {
      type: [String],
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

gigSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const gigWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (gigWithSlug.length) {
    this.slug = `${this.slug}-${gigWithSlug.length + 1}`;
  }
});

const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);

export default Gig;
