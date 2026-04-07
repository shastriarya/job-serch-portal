import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../modules/user/user.model.js";
import Job from "../modules/job/job.model.js";
import Application from "../modules/application/application.model.js";
import Notification from "../modules/notification/notification.model.js";
import logger from "../config/logger.js";

const DEMO_PASSWORD = "DemoPass123!";
const shouldRefresh = process.argv.includes("--refresh");

const demoUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav.demo@example.com",
    role: "user",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    profileCompleted: true,
    resume: "/uploads/resumes/aarav-sharma-resume.pdf",
  },
  {
    name: "Priya Verma",
    email: "priya.demo@example.com",
    role: "user",
    skills: ["UI Design", "Figma", "HTML", "CSS", "Accessibility"],
    profileCompleted: true,
    resume: "/uploads/resumes/priya-verma-resume.pdf",
  },
  {
    name: "Rohan Mehta",
    email: "rohan.demo@example.com",
    role: "user",
    skills: ["Java", "Spring Boot", "MySQL", "AWS"],
    profileCompleted: true,
    resume: "/uploads/resumes/rohan-mehta-resume.pdf",
  },
  {
    name: "Nisha Kapoor",
    email: "nisha.recruiter@example.com",
    role: "recruiter",
    skills: ["Hiring", "Technical Screening", "Team Building"],
    profileCompleted: true,
  },
  {
    name: "Dev Malhotra",
    email: "dev.recruiter@example.com",
    role: "recruiter",
    skills: ["Product Hiring", "Sourcing", "Campus Recruitment"],
    profileCompleted: true,
  },
  {
    name: "Platform Admin",
    email: "admin.demo@example.com",
    role: "admin",
    skills: ["Operations", "Analytics", "Platform Management"],
    profileCompleted: true,
  },
];

const demoJobs = [
  {
    title: "Frontend Developer",
    company: "NovaStack Labs",
    location: "Bengaluru",
    salary: 900000,
    skills: ["React", "JavaScript", "CSS", "REST APIs"],
    description:
      "Build responsive product experiences, collaborate with backend teams, and improve performance across the user journey.",
    category: "private",
    type: "full-time",
    experienceLevel: "junior",
    recruiterEmail: "nisha.recruiter@example.com",
    savedByEmails: ["aarav.demo@example.com", "priya.demo@example.com"],
  },
  {
    title: "Backend Engineer",
    company: "CloudBridge Systems",
    location: "Hyderabad",
    salary: 1200000,
    skills: ["Node.js", "MongoDB", "System Design", "Docker"],
    description:
      "Design scalable APIs, improve reliability, and ship backend features for a growing hiring platform.",
    category: "private",
    type: "full-time",
    experienceLevel: "mid",
    recruiterEmail: "dev.recruiter@example.com",
    savedByEmails: ["aarav.demo@example.com", "rohan.demo@example.com"],
  },
  {
    title: "UI/UX Design Intern",
    company: "PixelMint Studio",
    location: "Remote",
    salary: 25000,
    skills: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
    description:
      "Support the design team with wireframes, prototype flows, and visual polish for web and mobile experiences.",
    category: "internship",
    type: "internship",
    experienceLevel: "fresher",
    recruiterEmail: "nisha.recruiter@example.com",
    savedByEmails: ["priya.demo@example.com"],
  },
  {
    title: "Software Engineer",
    company: "Digital Public Works",
    location: "Delhi",
    salary: 1050000,
    skills: ["Java", "Spring Boot", "SQL", "APIs"],
    description:
      "Build citizen-facing systems, improve public platform stability, and collaborate on secure engineering practices.",
    category: "government",
    type: "full-time",
    experienceLevel: "junior",
    recruiterEmail: "dev.recruiter@example.com",
    savedByEmails: ["rohan.demo@example.com"],
  },
  {
    title: "Data Analyst",
    company: "Global Insight Partners",
    location: "Singapore",
    salary: 1800000,
    skills: ["SQL", "Python", "Power BI", "Statistics"],
    description:
      "Translate hiring and product metrics into dashboards and recommendations for international business teams.",
    category: "overseas",
    type: "full-time",
    experienceLevel: "mid",
    recruiterEmail: "nisha.recruiter@example.com",
    savedByEmails: ["aarav.demo@example.com", "rohan.demo@example.com"],
  },
  {
    title: "Part-Time Support Engineer",
    company: "ScaleDesk",
    location: "Pune",
    salary: 420000,
    skills: ["Troubleshooting", "Linux", "Customer Support", "Documentation"],
    description:
      "Handle customer issues, document recurring fixes, and partner with engineering to close the loop on incidents.",
    category: "private",
    type: "part-time",
    experienceLevel: "fresher",
    recruiterEmail: "dev.recruiter@example.com",
    savedByEmails: ["aarav.demo@example.com"],
  },
];

const demoApplications = [
  {
    userEmail: "aarav.demo@example.com",
    jobTitle: "Frontend Developer",
    status: "shortlisted",
    score: 91,
  },
  {
    userEmail: "aarav.demo@example.com",
    jobTitle: "Backend Engineer",
    status: "applied",
    score: 84,
  },
  {
    userEmail: "priya.demo@example.com",
    jobTitle: "UI/UX Design Intern",
    status: "selected",
    score: 96,
  },
  {
    userEmail: "rohan.demo@example.com",
    jobTitle: "Software Engineer",
    status: "shortlisted",
    score: 88,
  },
  {
    userEmail: "rohan.demo@example.com",
    jobTitle: "Data Analyst",
    status: "rejected",
    score: 67,
  },
];

const demoNotifications = [
  {
    userEmail: "aarav.demo@example.com",
    type: "application",
    message: "Your application for Frontend Developer has been shortlisted.",
    relatedKey: { kind: "job", title: "Frontend Developer" },
    read: false,
  },
  {
    userEmail: "priya.demo@example.com",
    type: "application",
    message: "Congratulations! You were selected for the UI/UX Design Intern role.",
    relatedKey: { kind: "job", title: "UI/UX Design Intern" },
    read: false,
  },
  {
    userEmail: "rohan.demo@example.com",
    type: "job",
    message: "A new overseas role matching your SQL and analytics skills is now live.",
    relatedKey: { kind: "job", title: "Data Analyst" },
    read: true,
  },
  {
    userEmail: "admin.demo@example.com",
    type: "system",
    message: "Demo showcase data is available for dashboards and API walkthroughs.",
    read: false,
  },
];

const getPasswordHash = async () => bcrypt.hash(DEMO_PASSWORD, 12);

const createOrUpdateUsers = async () => {
  const password = await getPasswordHash();
  const userMap = new Map();

  for (const user of demoUsers) {
    const savedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { ...user, password } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    userMap.set(savedUser.email, savedUser);
  }

  return userMap;
};

const createOrUpdateJobs = async (userMap) => {
  const jobMap = new Map();

  for (const job of demoJobs) {
    const recruiter = userMap.get(job.recruiterEmail);
    const savedBy = job.savedByEmails
      .map((email) => userMap.get(email)?._id)
      .filter(Boolean);

    const savedJob = await Job.findOneAndUpdate(
      {
        title: job.title,
        company: job.company,
        location: job.location,
      },
      {
        $set: {
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          skills: job.skills,
          description: job.description,
          category: job.category,
          type: job.type,
          experienceLevel: job.experienceLevel,
          createdBy: recruiter._id,
          savedBy,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    jobMap.set(savedJob.title, savedJob);
  }

  return jobMap;
};

const createOrUpdateApplications = async (userMap, jobMap) => {
  for (const application of demoApplications) {
    const user = userMap.get(application.userEmail);
    const job = jobMap.get(application.jobTitle);

    await Application.findOneAndUpdate(
      { user: user._id, job: job._id },
      {
        $set: {
          user: user._id,
          job: job._id,
          status: application.status,
          score: application.score,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }
};

const createNotifications = async (userMap, jobMap) => {
  const demoUserIds = [...userMap.values()].map((user) => user._id);
  await Notification.deleteMany({ user: { $in: demoUserIds } });

  const notifications = demoNotifications.map((notification) => {
    const relatedJob =
      notification.relatedKey?.kind === "job"
        ? jobMap.get(notification.relatedKey.title)
        : null;

    return {
      user: userMap.get(notification.userEmail)._id,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      relatedId: relatedJob?._id,
    };
  });

  await Notification.insertMany(notifications);
};

const refreshDemoData = async (userMap) => {
  const demoUserIds = [...userMap.values()].map((user) => user._id);
  await Application.deleteMany({ user: { $in: demoUserIds } });
  await Job.deleteMany({ createdBy: { $in: demoUserIds } });
  await Notification.deleteMany({ user: { $in: demoUserIds } });
};

const run = async () => {
  try {
    await connectDB();

    const existingUsers = await User.find({
      email: { $in: demoUsers.map((user) => user.email) },
    }).select("_id email");

    const existingUserMap = new Map(
      existingUsers.map((user) => [user.email, user]),
    );

    if (shouldRefresh && existingUsers.length > 0) {
      await refreshDemoData(existingUserMap);
    }

    const userMap = await createOrUpdateUsers();
    const jobMap = await createOrUpdateJobs(userMap);
    await createOrUpdateApplications(userMap, jobMap);
    await createNotifications(userMap, jobMap);

    logger.info("Demo data seeded successfully.");
    console.log("");
    console.log("Demo accounts created or updated:");
    console.log(`- Admin: admin.demo@example.com / ${DEMO_PASSWORD}`);
    console.log(`- Recruiter: nisha.recruiter@example.com / ${DEMO_PASSWORD}`);
    console.log(`- Recruiter: dev.recruiter@example.com / ${DEMO_PASSWORD}`);
    console.log(`- User: aarav.demo@example.com / ${DEMO_PASSWORD}`);
    console.log(`- User: priya.demo@example.com / ${DEMO_PASSWORD}`);
    console.log(`- User: rohan.demo@example.com / ${DEMO_PASSWORD}`);
    console.log("");
    console.log(
      `Seed summary: ${userMap.size} users, ${jobMap.size} jobs, ${demoApplications.length} applications, ${demoNotifications.length} notifications.`,
    );
  } catch (error) {
    logger.error("Unable to seed demo data.", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
