const mongoose = require('mongoose');

// 定義 STAR 報告的 Schema
const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: '未命名報告'
  },
  situation: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  result: {
    type: String,
    required: true,
    trim: true
  },
  competency: {
    type: String,
    required: true,
    enum: ['integrity', 'excellence', 'innovation', 'service', 'teamwork']
  },
  storeCategory: {
    type: String,
    required: true,
    enum: ['skincare', 'makeup', 'fragrance', 'women_luxury', 'men_luxury', 'digital', 
           'toys', 'home', 'souvenir', 'tobacco_alcohol']
  },
  originalStory: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 添加報告 Schema 的索引，以便更快檢索
reportSchema.index({ name: 1, competency: 1, storeCategory: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;