const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// 生成 STAR 報告
router.post('/generate', reportController.generateStarReport);

// 保存報告
router.post('/reports', reportController.saveReport);

// 獲取報告列表（可依條件過濾）
router.get('/reports', reportController.getReports);

// 根據 ID 獲取單個報告
router.get('/reports/:id', reportController.getReportById);

module.exports = router;