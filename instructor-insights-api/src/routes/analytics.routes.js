const express = require('express');
const router = express.Router();
const {
  getInstructorSummary,
  getCoursePerformance,
  getPerformanceTrends
} = require('../controllers/analytics.controller');

// Log when routes are loaded
console.log('✅ Analytics routes loaded');

// GET /api/v1/analytics/instructor-summary/:instructorId
router.get('/instructor-summary/:instructorId', (req, res, next) => {
  console.log(`📥 [ROUTE] GET /instructor-summary/${req.params.instructorId}`);
  next();
}, getInstructorSummary);

// GET /api/v1/analytics/course-performance/:instructorId
router.get('/course-performance/:instructorId', (req, res, next) => {
  console.log(`📥 [ROUTE] GET /course-performance/${req.params.instructorId}`);
  next();
}, getCoursePerformance);

// GET /api/v1/analytics/performance-trends/:instructorId
router.get('/performance-trends/:instructorId', (req, res, next) => {
  console.log(`📥 [ROUTE] GET /performance-trends/${req.params.instructorId}?timeframe=${req.query.timeframe || 'monthly'}`);
  next();
}, getPerformanceTrends);

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Analytics router is working',
    timestamp: new Date().toISOString(),
    routes: [
      'GET /instructor-summary/:instructorId',
      'GET /course-performance/:instructorId',
      'GET /performance-trends/:instructorId',
      'GET /test'
    ]
  });
});

module.exports = router;