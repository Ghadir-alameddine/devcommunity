import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing");
}

await mongoose.connect(mongoUri);

const users = mongoose.connection.collection("users");
const communities = mongoose.connection.collection("communities");

const user = await users.findOne({});

if (!user) {
  throw new Error("No user found. Sign in before running the seed.");
}

const communityData = [
  {
    name: "Next.js Developers",
    slug: "nextjs-developers",
    description: "A community for Next.js developers.",
  },
  {
    name: "Python Developers",
    slug: "python-developers",
    description: "A community for Python developers.",
  },
  {
    name: "DevOps Community",
    slug: "devops-community",
    description: "A community for DevOps engineers.",
  },
];

for (const community of communityData) {
  await communities.updateOne(
    { slug: community.slug },
    {
      $set: {
        ...community,
        createdBy: user._id,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

console.log("Communities seeded successfully.");

await mongoose.disconnect();