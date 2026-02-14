const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('✅ Database cleared\n');

    // Create instructors
    console.log('👨‍🏫 Creating instructors...');
    const janeDoe = await User.create({
      name: 'Jane Doe',
      email: 'jane.doe@paceinstitute.com',
      bio: 'Senior React Instructor with 10+ years experience'
    });
    
    const aliceJohnson = await User.create({
      name: 'Alice Johnson',
      email: 'alice.johnson@paceinstitute.com',
      bio: 'Node.js and Python Instructor'
    });
    
    console.log(`   ✅ Jane Doe: ${janeDoe._id}`);
    console.log(`   ✅ Alice Johnson: ${aliceJohnson._id}`);

    // Create students
    console.log('\n👥 Creating students...');
    const students = await User.create([
      { name: 'John Smith', email: 'john.smith@email.com', bio: 'Student' },
      { name: 'Sarah Wilson', email: 'sarah.w@email.com', bio: 'Student' },
      { name: 'Mike Brown', email: 'mike.b@email.com', bio: 'Student' },
      { name: 'Emma Davis', email: 'emma.d@email.com', bio: 'Student' },
      { name: 'Chris Lee', email: 'chris.l@email.com', bio: 'Student' }
    ]);
    console.log(`   ✅ Created ${students.length} students`);

    // Create courses for Jane Doe
    console.log('\n📚 Creating courses for Jane Doe...');
    const janeCourses = await Course.create([
      {
        title: 'Advanced React 2026',
        instructorId: janeDoe._id,
        price: 299,
        category: 'Frontend Development'
      },
      {
        title: 'Node.js Masterclass',
        instructorId: janeDoe._id,
        price: 249,
        category: 'Backend Development'
      },
      {
        title: 'TypeScript Fundamentals',
        instructorId: janeDoe._id,
        price: 199,
        category: 'Programming Languages'
      }
    ]);
    console.log(`   ✅ Created ${janeCourses.length} courses for Jane`);

    // Create courses for Alice Johnson
    console.log('\n📚 Creating courses for Alice Johnson...');
    const aliceCourses = await Course.create([
      {
        title: 'Python for Beginners',
        instructorId: aliceJohnson._id,
        price: 199,
        category: 'Programming Languages'
      },
      {
        title: 'Django Web Framework',
        instructorId: aliceJohnson._id,
        price: 299,
        category: 'Web Development'
      }
    ]);
    console.log(`   ✅ Created ${aliceCourses.length} courses for Alice`);

    // Create enrollments for Jane's courses
    console.log('\n📝 Creating enrollments for Jane\'s courses...');
    
    // Advanced React enrollments (most popular)
    const enrollments = await Enrollment.create([
      // Advanced React - 5 enrollments
      { studentId: students[0]._id, courseId: janeCourses[0]._id, progress: 75, rating: 5 },
      { studentId: students[1]._id, courseId: janeCourses[0]._id, progress: 90, rating: 4 },
      { studentId: students[2]._id, courseId: janeCourses[0]._id, progress: 45, rating: 5 },
      { studentId: students[3]._id, courseId: janeCourses[0]._id, progress: 100, rating: 5 },
      { studentId: students[4]._id, courseId: janeCourses[0]._id, progress: 60, rating: 4 },
      
      // Node.js Masterclass - 3 enrollments
      { studentId: students[0]._id, courseId: janeCourses[1]._id, progress: 30, rating: 4 },
      { studentId: students[2]._id, courseId: janeCourses[1]._id, progress: 85, rating: 5 },
      { studentId: students[4]._id, courseId: janeCourses[1]._id, progress: 20, rating: 4 },
      
      // TypeScript Fundamentals - 2 enrollments
      { studentId: students[1]._id, courseId: janeCourses[2]._id, progress: 95, rating: 5 },
      { studentId: students[3]._id, courseId: janeCourses[2]._id, progress: 50, rating: 4 }
    ]);

    // Create enrollments for Alice's courses
    console.log('📝 Creating enrollments for Alice\'s courses...');
    
    await Enrollment.create([
      // Python for Beginners - 3 enrollments
      { studentId: students[0]._id, courseId: aliceCourses[0]._id, progress: 80, rating: 5 },
      { studentId: students[2]._id, courseId: aliceCourses[0]._id, progress: 60, rating: 4 },
      { studentId: students[4]._id, courseId: aliceCourses[0]._id, progress: 40, rating: 4 },
      
      // Django Web Framework - 2 enrollments
      { studentId: students[1]._id, courseId: aliceCourses[1]._id, progress: 70, rating: 5 },
      { studentId: students[3]._id, courseId: aliceCourses[1]._id, progress: 30, rating: 4 }
    ]);

    console.log(`   ✅ Created total enrollments`);

    // Calculate expected results for Jane
    const janeTotalGross = (299 * 5) + (249 * 3) + (199 * 2); // 299*5=1495, 249*3=747, 199*2=398, Total=2640
    const janePlatformFee = janeTotalGross * 0.10; // 264
    const janeNetTakeHome = janeTotalGross - janePlatformFee; // 2376
    const janeAvgRating = (5+4+5+5+4+4+5+4+5+4) / 10; // 45/10 = 4.5

    // Calculate expected results for Alice
    const aliceTotalGross = (199 * 3) + (299 * 2); // 199*3=597, 299*2=598, Total=1195
    const alicePlatformFee = aliceTotalGross * 0.10; // 119.5
    const aliceNetTakeHome = aliceTotalGross - alicePlatformFee; // 1075.5
    const aliceAvgRating = (5+4+4+5+4) / 5; // 22/5 = 4.4

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    
    console.log('\n📊 JANE DOE (Instructor)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${janeDoe._id}`);
    console.log(`Expected Response:`);
    console.log(JSON.stringify({
      instructorName: janeDoe.name,
      totalStudents: 5, // 5 unique students
      averageCourseRating: 4.5,
      topPerformingCourse: 'Advanced React 2026',
      revenue: {
        totalGross: janeTotalGross,
        platformFee: janePlatformFee,
        netTakeHome: janeNetTakeHome
      }
    }, null, 2));

    console.log('\n📊 ALICE JOHNSON (Instructor)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${aliceJohnson._id}`);
    console.log(`Expected Response:`);
    console.log(JSON.stringify({
      instructorName: aliceJohnson.name,
      totalStudents: 5, // 5 unique students
      averageCourseRating: 4.4,
      topPerformingCourse: 'Python for Beginners', // Has 3 enrollments
      revenue: {
        totalGross: aliceTotalGross,
        platformFee: alicePlatformFee,
        netTakeHome: aliceNetTakeHome
      }
    }, null, 2));

    console.log('\n🔗 TEST URLS:');
    console.log(`Jane Doe:   http://localhost:3000/api/v1/analytics/instructor-summary/${janeDoe._id}`);
    console.log(`Alice Johnson: http://localhost:3000/api/v1/analytics/instructor-summary/${aliceJohnson._id}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDatabase();