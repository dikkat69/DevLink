const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./.env" });

const User = require("./Src/models/User");
const ConnectionRequest = require("./Src/models/ConnectRequest");
const Chat = require("./Src/models/Chat");

const indianMaleNames = [
  'Aarav', 'Rohan', 'Aditya', 'Arjun', 'Siddharth', 'Vivek', 'Rahul', 'Akash',
  'Aman', 'Ishaan', 'Karan', 'Kabir', 'Sameer', 'Tushar', 'Varun', 'Yash',
  'Abhishek', 'Gaurav', 'Harsh', 'Krunal', 'Manoj', 'Nikhil', 'Rajesh', 'Sanjay',
  'Vikram'
];

const indianFemaleNames = [
  'Ananya', 'Priya', 'Kavya', 'Sneha', 'Ishita', 'Neha', 'Meera', 'Diya',
  'Maya', 'Nisha', 'Riya', 'Shreya', 'Zoya', 'Aditi', 'Divya', 'Jyoti',
  'Pooja', 'Deepika', 'Kriti', 'Shruti', 'Preeti', 'Swati', 'Kiran', 'Nidhi',
  'Komal'
];

const indianLastNames = [
  'Mehta', 'Iyer', 'Kulkarni', 'Nair', 'Sharma', 'Reddy', 'Menon', 'Das',
  'Jain', 'Kapoor', 'Patil', 'Bansal', 'Choudhary', 'Krishnan', 'Verma',
  'Mukherjee', 'Joshi', 'Pillai', 'Rao', 'Sen', 'Gupta', 'Patel', 'Sinha',
  'Trivedi', 'Bose', 'Pandey', 'Mishra', 'Prasad'
];

const internationalMaleNames = [
  'Ethan', 'Liam', 'Lucas', 'Oliver', 'John', 'Daniel', 'Alexander', 'William',
  'Benjamin', 'Michael'
];

const internationalFemaleNames = [
  'Emma', 'Olivia', 'Sophia', 'Charlotte', 'Sarah', 'Grace', 'Emily', 'Chloe',
  'Amelia', 'Lily'
];

const internationalLastNames = [
  'Brooks', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller',
  'Davis', 'Wilson', 'Taylor', 'Thomas', 'Anderson', 'White', 'Martin'
];

const indianCities = [
  'Delhi', 'Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Nashik',
  'Indore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kochi', 'Coimbatore',
  'Mysuru', 'Visakhapatnam', 'Kolkata', 'Bhubaneswar', 'Guwahati', 'Ranchi',
  'Patna', 'Bhopal', 'Raipur', 'Nagpur', 'Shillong', 'Imphal', 'Agartala',
  'Chandigarh', 'Jaipur', 'Lucknow', 'Dehradun', 'Amritsar', 'Jammu'
];

const internationalCities = [
  'New York, USA', 'Toronto, Canada', 'London, UK', 'Berlin, Germany',
  'Singapore', 'Sydney, Australia', 'Tokyo, Japan', 'Dubai, UAE',
  'Amsterdam, Netherlands', 'Paris, France'
];

const skillsPool = {
  Frontend: ['React', 'Next.js', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'],
  Backend: ['Node.js', 'Express', 'Java', 'Spring Boot', 'Python', 'Django', 'FastAPI', 'Go', 'C#', '.NET'],
  Database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
  AIML: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'LLMs', 'RAG', 'LangChain'],
  CloudDevOps: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'],
  Mobile: ['Flutter', 'React Native', 'Android', 'Kotlin', 'Swift']
};

const bioTemplates = {
  Web: [
    "Frontend developer looking for hackathon teammates to build responsive web apps.",
    "Full-stack enthusiast excited about building open-source developer tooling and SaaS products.",
    "Javascript developer passionate about UI/UX and polished user interfaces."
  ],
  Backend: [
    "Backend-focused engineer working on microservices, APIs, and scalable infrastructure.",
    "Node.js lover looking to collaborate on cloud-native backend projects and databases.",
    "Systems enthusiast interested in distributed logging, caching, and server-side logic."
  ],
  AIML: [
    "CS student focusing on NLP and LLM integrations. Let's collaborate on AI agents!",
    "Machine learning developer working on RAG applications and search ranking pipelines.",
    "Data scientist passionate about deep learning, model training, and custom embeddings."
  ],
  Mobile: [
    "Cross-platform mobile developer who loves Swift, Kotlin, and clean architectures.",
    "Flutter developer building smooth mobile apps. Looking for backend partners for startups.",
    "Mobile specialist building open-source libraries and responsive layout widgets."
  ],
  DevOps: [
    "Cloud engineer focused on containerization, Kubernetes, and automated CI/CD pipelines.",
    "DevOps specialist who loves serverless, AWS deployments, and infrastructure as code."
  ],
  Cyber: [
    "Security enthusiast looking to audit code, secure API endpoints, and learn pen-testing.",
    "Cybersecurity analyst building open-source threat detection and packet analysis tools."
  ]
};

const getDeterministicItem = (list, index) => list[index % list.length];

const seed = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connected successfully.");

    // Check if we should wipe data (only if explicitly requested via command line flag)
    const forceWipe = process.argv.includes("--force-wipe-db");
    if (forceWipe) {
      console.warn("WARNING: --force-wipe-db flag detected! Wiping collections...");
      await User.deleteMany({});
      await ConnectionRequest.deleteMany({});
      await Chat.deleteMany({});
      console.log("Cleared all User, ConnectionRequest, and Chat documents.");
    } else {
      console.log("Safe seeding mode: Existing documents will be preserved.");
    }

    const passwordHash = await bcrypt.hash("Password123!", 10);

    // Ensure core test users exist
    let alice = await User.findOne({ emailId: "alice@example.com" });
    if (!alice) {
      alice = new User({
        firstName: "Alice",
        lastName: "Dev",
        emailId: "alice@example.com",
        password: passwordHash,
        age: 25,
        gender: "female",
        about: "React developer who loves UI design.",
        photoUrl: "https://geographyandyou.com/images/user-profile.png",
        skills: ["React", "Tailwind CSS", "JavaScript"]
      });
      await alice.save();
      console.log("Created core test user: Alice");
    }

    let bob = await User.findOne({ emailId: "bob@example.com" });
    if (!bob) {
      bob = new User({
        firstName: "Bobby",
        lastName: "Dev",
        emailId: "bob@example.com",
        password: passwordHash,
        age: 28,
        gender: "male",
        about: "Node.js backend engineer.",
        photoUrl: "https://geographyandyou.com/images/user-profile.png",
        skills: ["Node.js", "Express", "MongoDB"]
      });
      await bob.save();
      console.log("Created core test user: Bobby");
    }

    let charlie = await User.findOne({ emailId: "charlie@example.com" });
    if (!charlie) {
      charlie = new User({
        firstName: "Charlie",
        lastName: "Unconnected",
        emailId: "charlie@example.com",
        password: passwordHash,
        age: 30,
        gender: "male",
        about: "Python developer.",
        photoUrl: "https://geographyandyou.com/images/user-profile.png",
        skills: ["Python", "Django"]
      });
      await charlie.save();
      console.log("Created core test user: Charlie");
    }

    // Generate 75 Indian users
    const generatedUsers = [];
    for (let i = 1; i <= 75; i++) {
      const gender = i % 2 === 0 ? "female" : "male";
      const firstName = gender === "female" 
        ? getDeterministicItem(indianFemaleNames, i)
        : getDeterministicItem(indianMaleNames, i);
      const lastName = getDeterministicItem(indianLastNames, i + 5);
      const emailId = `demo.in.${i}@devlink.demo`;
      const city = getDeterministicItem(indianCities, i);
      const age = 19 + (i % 15); // ages 19 to 33

      let category = "Web";
      if (i % 6 === 0) category = "Web";
      else if (i % 6 === 1) category = "Backend";
      else if (i % 6 === 2) category = "AIML";
      else if (i % 6 === 3) category = "Mobile";
      else if (i % 6 === 4) category = "DevOps";
      else category = "Cyber";

      const bio = getDeterministicItem(bioTemplates[category], i) + ` Based in ${city}.`;

      const userSkills = [];
      if (category === "Web") {
        userSkills.push(getDeterministicItem(skillsPool.Frontend, i));
        userSkills.push(getDeterministicItem(skillsPool.Frontend, i + 1));
        userSkills.push(getDeterministicItem(skillsPool.Database, i));
      } else if (category === "Backend") {
        userSkills.push(getDeterministicItem(skillsPool.Backend, i));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i + 1));
        userSkills.push(getDeterministicItem(skillsPool.Database, i));
      } else if (category === "AIML") {
        userSkills.push(getDeterministicItem(skillsPool.AIML, i));
        userSkills.push(getDeterministicItem(skillsPool.AIML, i + 1));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i));
      } else if (category === "Mobile") {
        userSkills.push(getDeterministicItem(skillsPool.Mobile, i));
        userSkills.push(getDeterministicItem(skillsPool.Mobile, i + 1));
        userSkills.push(getDeterministicItem(skillsPool.Frontend, i));
      } else if (category === "DevOps") {
        userSkills.push(getDeterministicItem(skillsPool.CloudDevOps, i));
        userSkills.push(getDeterministicItem(skillsPool.CloudDevOps, i + 1));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i));
      } else {
        userSkills.push("Cybersecurity");
        userSkills.push(getDeterministicItem(skillsPool.CloudDevOps, i));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i + 1));
      }
      userSkills.push("Git");
      if (i % 3 === 0) userSkills.push("GitHub");

      const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`;

      generatedUsers.push({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        age,
        gender,
        about: bio.substring(0, 280),
        skills: [...new Set(userSkills)],
        photoUrl
      });
    }

    // Generate 15 International users
    for (let i = 1; i <= 15; i++) {
      const gender = i % 2 === 0 ? "female" : "male";
      const firstName = gender === "female"
        ? getDeterministicItem(internationalFemaleNames, i)
        : getDeterministicItem(internationalMaleNames, i);
      const lastName = getDeterministicItem(internationalLastNames, i + 2);
      const emailId = `demo.int.${i}@devlink.demo`;
      const location = getDeterministicItem(internationalCities, i);
      const age = 20 + (i % 12); // ages 20 to 31

      let category = "Web";
      if (i % 3 === 0) category = "Web";
      else if (i % 3 === 1) category = "Backend";
      else category = "AIML";

      const bio = getDeterministicItem(bioTemplates[category], i + 3) + ` Collaborating from ${location}.`;

      const userSkills = [];
      if (category === "Web") {
        userSkills.push(getDeterministicItem(skillsPool.Frontend, i + 4));
        userSkills.push(getDeterministicItem(skillsPool.Frontend, i + 5));
        userSkills.push(getDeterministicItem(skillsPool.Database, i + 1));
      } else if (category === "Backend") {
        userSkills.push(getDeterministicItem(skillsPool.Backend, i + 4));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i + 5));
        userSkills.push(getDeterministicItem(skillsPool.Database, i + 2));
      } else {
        userSkills.push(getDeterministicItem(skillsPool.AIML, i + 3));
        userSkills.push(getDeterministicItem(skillsPool.AIML, i + 4));
        userSkills.push(getDeterministicItem(skillsPool.Backend, i + 6));
      }
      userSkills.push("Git");

      const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`;

      generatedUsers.push({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        age,
        gender,
        about: bio.substring(0, 280),
        skills: [...new Set(userSkills)],
        photoUrl
      });
    }

    // Save/Update users safely
    let createdUsersCount = 0;
    let updatedUsersCount = 0;
    const dbUsers = [];
    for (const u of generatedUsers) {
      let existing = await User.findOne({ emailId: u.emailId });
      if (!existing) {
        existing = new User(u);
        await existing.save();
        createdUsersCount++;
      } else {
        // If the user already exists, update name, gender, and photoUrl to ensure consistency
        let modified = false;
        if (existing.firstName !== u.firstName) {
          existing.firstName = u.firstName;
          modified = true;
        }
        if (existing.lastName !== u.lastName) {
          existing.lastName = u.lastName;
          modified = true;
        }
        if (existing.gender !== u.gender) {
          existing.gender = u.gender;
          modified = true;
        }
        if (existing.photoUrl !== u.photoUrl) {
          existing.photoUrl = u.photoUrl;
          modified = true;
        }
        if (modified) {
          await existing.save();
          updatedUsersCount++;
        }
      }
      dbUsers.push(existing);
    }
    console.log(`Saved ${createdUsersCount} new demo users. Updated name/gender consistency for ${updatedUsersCount} existing demo users. (Skipped ${generatedUsers.length - (createdUsersCount + updatedUsersCount)} unchanged existing).`);

    // Ensure connection request between Alice and Bob exists
    const aliceConn = await ConnectionRequest.findOne({
      $or: [
        { fromID: alice._id, toID: bob._id },
        { fromID: bob._id, toID: alice._id }
      ]
    });
    if (!aliceConn) {
      const conn = new ConnectionRequest({
        fromID: alice._id,
        toID: bob._id,
        status: "accepted"
      });
      await conn.save();
      console.log("Created accepted connection request between Alice and Bobby.");
    }

    // Create a small subset of deterministic relationships among demo users to demonstrate features
    const relationsToCreate = [
      { fromIdx: 0, toIdx: 1, status: "accepted" }, // demo.in.1 <-> demo.in.2
      { fromIdx: 2, toIdx: 3, status: "interested" }, // demo.in.3 -> demo.in.4
      { fromIdx: 4, toIdx: 5, status: "accepted" }, // demo.in.5 <-> demo.in.6
      { fromIdx: 6, toIdx: 7, status: "interested" }, // demo.in.7 -> demo.in.8
      { fromIdx: 8, toIdx: 9, status: "accepted" }  // demo.in.9 <-> demo.in.10
    ];

    let createdRelationsCount = 0;
    for (const rel of relationsToCreate) {
      const fromUser = dbUsers[rel.fromIdx];
      const toUser = dbUsers[rel.toIdx];

      if (fromUser && toUser) {
        const existingRel = await ConnectionRequest.findOne({
          $or: [
            { fromID: fromUser._id, toID: toUser._id },
            { fromID: toUser._id, toID: fromUser._id }
          ]
        });

        if (!existingRel) {
          const conn = new ConnectionRequest({
            fromID: fromUser._id,
            toID: toUser._id,
            status: rel.status
          });
          await conn.save();
          createdRelationsCount++;
        }
      }
    }
    console.log(`Created ${createdRelationsCount} connections/relationships.`);

    console.log("Seed processing complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed execution failed:", err);
    process.exit(1);
  }
};

seed();
