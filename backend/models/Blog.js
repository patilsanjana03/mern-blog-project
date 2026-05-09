const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    content: {
      type: String,
      required: [true, 'Please add some content'],
    },

    category: {
      type: String,
      required: [true, 'Please specify a category'],
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    image: {
      type: String,
      default: 'https://via.placeholder.com/800x400?text=No+Image',
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },

    attachments: [
      {
        filename: String,
        url: String,
        fileType: String,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// TEXT SEARCH INDEX
blogSchema.index(
  { title: 'text', content: 'text' },
  { weights: { title: 5, content: 1 } }
);




// AUTO GENERATE UNIQUE SLUG
blogSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, {
        lower: true,
        strict: true,
      }) +
      '-' +
      Date.now();
  }
});

module.exports = mongoose.model('Blog', blogSchema);