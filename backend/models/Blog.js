const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: { 
        type: String, unique: true 
    }, // e.g., "my-awesome-post" - Great for SEO
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
      index: true // Indexing tags makes filtering fast
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/800x400?text=No+Image', 
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true
    },
    image: { 
      type: String, 
      default: 'https://via.placeholder.com/800x400?text=No+Image' 
    },
    
    // Downloadable files (PDFs, Docs, etc.)
    attachments: [
      {
        filename: String,
        url: String,
        fileType: String,
      }
    ],
    views: {
      type: Number,
      default: 0,
    },
    // NEW: Integer for lightning-fast sorting
    likesCount: { 
        type: Number, 
        default: 0 
    }, 
    // NEW: Soft Delete flag
    isDeleted: { 
        type: Boolean, 
        default: false 
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
  { timestamps: true } 
);

// SENIOR MOVE: Create a Compound Text Index for optimized searching
// Weights give the title higher importance than the content in search results
blogSchema.index(
  { title: 'text', content: 'text' }, 
  { weights: { title: 5, content: 1 } }
);

module.exports = mongoose.model('Blog', blogSchema);