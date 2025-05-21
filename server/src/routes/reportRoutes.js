const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// 生成 STAR 報告
router.post('/generate', reportController.generateStarReport);

// 保存報告
router.post('/reports', reportController.saveReport);

// 獲取報告
router.get('/reports', reportController.getReports);

module.exports = router;