const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const mongoose = require('mongoose');

class AnalyticsService {
  
  async getInstructorSummary(instructorId) {
    console.log('\n🔍 [SERVICE] Processing request for instructor ID:', instructorId);

    // Validate instructor exists
    const instructor = await this.validateInstructor(instructorId);
    
    // Get all courses for this instructor
    const courses = await this.getInstructorCourses(instructorId);
    
    if (courses.length === 0) {
      return this.buildEmptyResponse(instructor.name);
    }

    // Get all enrollments for these courses
    const enrollments = await this.getCourseEnrollments(courses);
    
    if (enrollments.length === 0) {
      return this.buildNoEnrollmentsResponse(instructor.name, courses);
    }

    // Calculate statistics
    const stats = await this.calculateStatistics(courses, enrollments);

    return this.buildSuccessResponse(instructor.name, stats);
  }

  async validateInstructor(instructorId) {
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      throw new Error('Invalid instructor ID format');
    }

    const instructor = await User.findById(instructorId);
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    console.log('✅ [SERVICE] Found instructor:', instructor.name);
    return instructor;
  }

  async getInstructorCourses(instructorId) {
    const courses = await Course.find({ instructorId }).lean();
    console.log(`📚 [SERVICE] Found ${courses.length} courses for instructor`);
    return courses;
  }

  async getCourseEnrollments(courses) {
    const courseIds = courses.map(c => c._id);
    
    const enrollments = await Enrollment.find({
      courseId: { $in: courseIds }
    })
    .populate('courseId', 'title price')
    .populate('studentId', 'name email')
    .lean();

    console.log(`📝 [SERVICE] Found ${enrollments.length} enrollments`);
    return enrollments;
  }

  async calculateStatistics(courses, enrollments) {
    // Calculate unique students
    const uniqueStudentIds = new Set();
    enrollments.forEach(e => {
      if (e.studentId && e.studentId._id) {
        uniqueStudentIds.add(e.studentId._id.toString());
      }
    });
    const totalStudents = uniqueStudentIds.size;

    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    enrollments.forEach(e => {
      if (e.rating) {
        totalRating += e.rating;
        ratingCount++;
      }
    });
    const averageCourseRating = ratingCount > 0 
      ? Math.round((totalRating / ratingCount) * 10) / 10 
      : 0;

    // Calculate revenue
    let totalGross = 0;
    enrollments.forEach(e => {
      if (e.courseId && e.courseId.price) {
        totalGross += e.courseId.price;
      }
    });
    
    const platformFee = Math.round((totalGross * 0.10) * 100) / 100;
    const netTakeHome = Math.round((totalGross - platformFee) * 100) / 100;

    // Find top performing course
    const courseEnrollmentCount = {};
    enrollments.forEach(e => {
      if (e.courseId && e.courseId._id) {
        const courseIdStr = e.courseId._id.toString();
        courseEnrollmentCount[courseIdStr] = (courseEnrollmentCount[courseIdStr] || 0) + 1;
      }
    });

    let topCourseId = null;
    let maxEnrollments = 0;
    
    Object.entries(courseEnrollmentCount).forEach(([courseId, count]) => {
      if (count > maxEnrollments) {
        maxEnrollments = count;
        topCourseId = courseId;
      }
    });

    const topCourse = courses.find(c => c._id.toString() === topCourseId);
    const topPerformingCourse = topCourse?.title || courses[0]?.title || 'Unknown';

    console.log('\n📊 [SERVICE] Statistics calculated:');
    console.log(`   👥 Total unique students: ${totalStudents}`);
    console.log(`   ⭐ Average rating: ${averageCourseRating}`);
    console.log(`   💰 Total gross: $${totalGross}`);
    console.log(`   💰 Platform fee: $${platformFee}`);
    console.log(`   💰 Net take home: $${netTakeHome}`);
    console.log(`   🏆 Top course: ${topPerformingCourse}`);

    return {
      totalStudents,
      averageCourseRating,
      topPerformingCourse,
      revenue: {
        totalGross: Math.round(totalGross * 100) / 100,
        platformFee,
        netTakeHome
      }
    };
  }

  buildEmptyResponse(instructorName) {
    return {
      instructorName,
      totalStudents: 0,
      averageCourseRating: 0,
      topPerformingCourse: 'No courses found',
      revenue: {
        totalGross: 0,
        platformFee: 0,
        netTakeHome: 0
      }
    };
  }

  buildNoEnrollmentsResponse(instructorName, courses) {
    return {
      instructorName,
      totalStudents: 0,
      averageCourseRating: 0,
      topPerformingCourse: courses[0]?.title || 'No courses',
      revenue: {
        totalGross: 0,
        platformFee: 0,
        netTakeHome: 0
      }
    };
  }

  buildSuccessResponse(instructorName, stats) {
    return {
      instructorName,
      ...stats
    };
  }
}

module.exports = new AnalyticsService();