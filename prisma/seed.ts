import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a business
  const business = await prisma.business.create({
    data: {
      instituteName: 'ContentKosh Academy',
      tagline: 'Your Gateway to Success',
      contactNumber: '+91-9876543210',
      email: 'info@contentkosh.com',
      address: '123 Education Street, Learning City, LC 12345',
      youtubeUrl: 'https://youtube.com/@contentkosh',
      instagramUrl: 'https://instagram.com/contentkosh',
      linkedinUrl: 'https://linkedin.com/company/contentkosh',
      facebookUrl: 'https://facebook.com/contentkosh',
    },
  });
  console.log('✅ Created business:', business.instituteName);

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Password#123', 10);

  // Create users of all types
  const users = await Promise.all([
    // SUPERADMIN
    prisma.user.create({
      data: {
        email: 'superadmin@contentkosh.com',
        password: hashedPassword,
        name: 'Super Admin',
      },
    }),
    // ADMIN
    prisma.user.create({
      data: {
        email: 'admin@contentkosh.com',
        password: hashedPassword,
        name: 'Admin User',
      },
    }),
    // TEACHER
    prisma.user.create({
      data: {
        email: 'teacher@contentkosh.com',
        password: hashedPassword,
        name: 'John Teacher',
      },
    }),
    // STUDENT
    prisma.user.create({
      data: {
        email: 'student@contentkosh.com',
        password: hashedPassword,
        name: 'Jane Student',
      },
    }),
    // GUEST
    prisma.user.create({
      data: {
        email: 'guest@contentkosh.com',
        password: hashedPassword,
        name: 'Guest User',
      },
    }),
  ]);

  console.log('✅ Created users:', users.map(u => `${u.name} (${u.email})`));

  // Assign users to business with appropriate roles
  const businessUsers = await Promise.all([
    prisma.businessUser.create({
      data: {
        userId: users[0].id, // SUPERADMIN
        businessId: business.id,
        role: UserRole.SUPERADMIN,
        isActive: true,
      },
    }),
    prisma.businessUser.create({
      data: {
        userId: users[1].id, // ADMIN
        businessId: business.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    }),
    prisma.businessUser.create({
      data: {
        userId: users[2].id, // TEACHER
        businessId: business.id,
        role: UserRole.TEACHER,
        isActive: true,
      },
    }),
    prisma.businessUser.create({
      data: {
        userId: users[3].id, // STUDENT
        businessId: business.id,
        role: UserRole.STUDENT,
        isActive: true,
      },
    }),
    prisma.businessUser.create({
      data: {
        userId: users[4].id, // GUEST
        businessId: business.id,
        role: UserRole.GUEST,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created business user assignments');

  // Create exams
  const exams = await Promise.all([
    prisma.exam.create({
      data: {
        name: 'UPSC Civil Services',
        description: 'Union Public Service Commission Civil Services Examination',
        isActive: true,
        businessId: business.id,
      },
    }),
    prisma.exam.create({
      data: {
        name: 'NEET',
        description: 'National Eligibility cum Entrance Test for Medical Courses',
        isActive: true,
        businessId: business.id,
      },
    }),
    prisma.exam.create({
      data: {
        name: 'JEE Main',
        description: 'Joint Entrance Examination for Engineering',
        isActive: true,
        businessId: business.id,
      },
    }),
  ]);

  console.log('✅ Created exams:', exams.map(e => e.name));

  // Create courses for each exam
  const courses = await Promise.all([
    // UPSC Courses
    prisma.course.create({
      data: {
        name: 'UPSC Prelims + Mains',
        description: 'Complete preparation for UPSC Prelims and Mains',
        duration: '12 months',
        isActive: true,
        examId: exams[0].id,
      },
    }),
    prisma.course.create({
      data: {
        name: 'UPSC Optional Subject - Geography',
        description: 'Geography optional subject preparation',
        duration: '8 months',
        isActive: true,
        examId: exams[0].id,
      },
    }),
    // NEET Courses
    prisma.course.create({
      data: {
        name: 'NEET Complete Course',
        description: 'Complete NEET preparation with all subjects',
        duration: '18 months',
        isActive: true,
        examId: exams[1].id,
      },
    }),
    prisma.course.create({
      data: {
        name: 'NEET Crash Course',
        description: 'Intensive NEET preparation for last 6 months',
        duration: '6 months',
        isActive: true,
        examId: exams[1].id,
      },
    }),
    // JEE Courses
    prisma.course.create({
      data: {
        name: 'JEE Main + Advanced',
        description: 'Complete JEE preparation for both Main and Advanced',
        duration: '24 months',
        isActive: true,
        examId: exams[2].id,
      },
    }),
  ]);

  console.log('✅ Created courses:', courses.map(c => c.name));

  // Create subjects for each course
  const subjects = await Promise.all([
    // UPSC Prelims + Mains subjects
    prisma.subject.create({
      data: {
        name: 'History',
        description: 'Indian History and World History',
        isActive: true,
        courseId: courses[0].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Geography',
        description: 'Physical and Human Geography',
        isActive: true,
        courseId: courses[0].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Polity',
        description: 'Indian Constitution and Political System',
        isActive: true,
        courseId: courses[0].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Economics',
        description: 'Indian Economy and Economic Concepts',
        isActive: true,
        courseId: courses[0].id,
      },
    }),
    // NEET subjects
    prisma.subject.create({
      data: {
        name: 'Physics',
        description: 'Physics for NEET',
        isActive: true,
        courseId: courses[2].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Chemistry',
        description: 'Chemistry for NEET',
        isActive: true,
        courseId: courses[2].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Biology',
        description: 'Biology for NEET',
        isActive: true,
        courseId: courses[2].id,
      },
    }),
    // JEE subjects
    prisma.subject.create({
      data: {
        name: 'Mathematics',
        description: 'Mathematics for JEE',
        isActive: true,
        courseId: courses[4].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Physics',
        description: 'Physics for JEE',
        isActive: true,
        courseId: courses[4].id,
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Chemistry',
        description: 'Chemistry for JEE',
        isActive: true,
        courseId: courses[4].id,
      },
    }),
  ]);

  console.log('✅ Created subjects:', subjects.map(s => s.name));

  // Create batches
  const batches = await Promise.all([
    prisma.batch.create({
      data: {
        codeName: 'UPSC2024A',
        displayName: 'UPSC 2024 Batch A',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        businessId: business.id,
      },
    }),
    prisma.batch.create({
      data: {
        codeName: 'NEET2024A',
        displayName: 'NEET 2024 Batch A',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        businessId: business.id,
      },
    }),
    prisma.batch.create({
      data: {
        codeName: 'JEE2024A',
        displayName: 'JEE 2024 Batch A',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        businessId: business.id,
      },
    }),
  ]);

  console.log('✅ Created batches:', batches.map(b => b.displayName));

  // Assign students to batches
  const batchUsers = await Promise.all([
    prisma.batchUser.create({
      data: {
        userId: users[3].id, // STUDENT
        batchId: batches[0].id, // UPSC batch
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created batch user assignments');

  // Create announcements
  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        heading: 'Welcome to ContentKosh Academy!',
        content: 'We are excited to have you join our learning community. Please check your course materials and schedule.',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        businessId: business.id,
        visibleToAdmins: true,
        visibleToTeachers: true,
        visibleToStudents: true,
      },
    }),
    prisma.announcement.create({
      data: {
        heading: 'UPSC Prelims Exam Date Announced',
        content: 'The UPSC Prelims examination is scheduled for June 16, 2024. Please prepare accordingly.',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-16'),
        isActive: true,
        businessId: business.id,
        visibleToAdmins: true,
        visibleToTeachers: true,
        visibleToStudents: true,
      },
    }),
    prisma.announcement.create({
      data: {
        heading: 'Teacher Training Session',
        content: 'All teachers are required to attend the training session on teaching methodologies.',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        businessId: business.id,
        visibleToAdmins: true,
        visibleToTeachers: true,
        visibleToStudents: false,
      },
    }),
  ]);

  console.log('✅ Created announcements:', announcements.map(a => a.heading));

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- 1 Business: ${business.instituteName}`);
  console.log(`- ${users.length} Users (all roles)`);
  console.log(`- ${businessUsers.length} Business User Assignments`);
  console.log(`- ${exams.length} Exams`);
  console.log(`- ${courses.length} Courses`);
  console.log(`- ${subjects.length} Subjects`);
  console.log(`- ${batches.length} Batches`);
  console.log(`- ${batchUsers.length} Batch User Assignments`);
  console.log(`- ${announcements.length} Announcements`);
  
  console.log('\n🔑 Test Credentials:');
  console.log('All users have password: password123');
  console.log('- Super Admin: superadmin@contentkosh.com');
  console.log('- Admin: admin@contentkosh.com');
  console.log('- Teacher: teacher@contentkosh.com');
  console.log('- Student: student@contentkosh.com');
  console.log('- Guest: guest@contentkosh.com');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
