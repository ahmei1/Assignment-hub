import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function main() {
  console.log("Seeding database...");

  // Clean slate (order respects FK constraints).
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const lecturer = await prisma.user.create({
    data: { name: "Dr. Smith", email: "lecturer@test.com", password, role: "LECTURER" },
  });

  const lecturer2 = await prisma.user.create({
    data: { name: "Dr. Justin", email: "justin@test.com", password, role: "LECTURER" },
  });

  const student = await prisma.user.create({
    data: { name: "John Doe", email: "student@test.com", password, role: "STUDENT" },
  });

  const student2 = await prisma.user.create({
    data: { name: "Jane Roe", email: "jane@test.com", password, role: "STUDENT" },
  });

  const dbCourse = await prisma.course.create({
    data: {
      name: "Database Administration",
      code: "CS301",
      description: "Designing, managing and optimizing relational databases.",
      joinPassword: "db301",
      lecturerId: lecturer.id,
    },
  });

  const webCourse = await prisma.course.create({
    data: {
      name: "Web Development",
      code: "CS205",
      description: "Building modern full-stack web applications.",
      joinPassword: "web205",
      lecturerId: lecturer.id,
    },
  });

  const linuxCourse = await prisma.course.create({
    data: {
      name: "Linux Fundamentals",
      code: "CS110",
      description: "Command line, permissions and shell scripting.",
      joinPassword: "linux110",
      lecturerId: lecturer2.id,
    },
  });

  // Enroll John in DB + Web; Jane in DB only.
  await prisma.enrollment.createMany({
    data: [
      { studentId: student.id, courseId: dbCourse.id },
      { studentId: student.id, courseId: webCourse.id },
      { studentId: student2.id, courseId: dbCourse.id },
    ],
  });

  const a1 = await prisma.assignment.create({
    data: {
      title: "ER Diagram Design",
      description: "Design an ER diagram for a library system.",
      dueDate: daysFromNow(3),
      courseId: dbCourse.id,
      lecturerId: lecturer.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: "SQL Query Optimization",
      description: "Optimize the provided set of slow queries.",
      dueDate: daysFromNow(10),
      courseId: dbCourse.id,
      lecturerId: lecturer.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: "React Portfolio",
      description: "Build a personal portfolio using React and Tailwind.",
      dueDate: daysFromNow(5),
      courseId: webCourse.id,
      lecturerId: lecturer.id,
    },
  });

  // One existing submission from John for the ER Diagram assignment.
  await prisma.submission.create({
    data: {
      assignmentId: a1.id,
      studentId: student.id,
      fileUrl: "http://localhost:5000/uploads/sample-er-diagram.pdf",
      notes: "First draft attached.",
      regNumber: "REG-2024-0001",
      status: "SUBMITTED",
    },
  });

  console.log("Seed complete.");
  console.log("Login with:");
  console.log("  Lecturer -> lecturer@test.com / password123");
  console.log("  Student  -> student@test.com  / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
