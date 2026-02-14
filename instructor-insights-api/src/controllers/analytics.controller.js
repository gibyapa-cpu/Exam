const analyticsService = require('../services/analytics.service');

const getInstructorSummary = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    console.log('\n🎮 [CONTROLLER] Received request for instructor:', instructorId);

    // Call service to get the data
    const data = await analyticsService.getInstructorSummary(instructorId);

    console.log('✅ [CONTROLLER] Sending successful response');
    
    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Error:', error.message);

    // Handle different types of errors
    if (error.message === 'Invalid instructor ID format') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Instructor not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get detailed course performance for an instructor
 */
const getCoursePerformance = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    const data = await analyticsService.getCoursePerformance(instructorId);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in getCoursePerformance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get performance trends over time
 */
const getPerformanceTrends = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { timeframe } = req.query;
    
    const data = await analyticsService.getPerformanceTrends(instructorId, timeframe);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in getPerformanceTrends:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getInstructorSummary,
  getCoursePerformance,
  getPerformanceTrends
};