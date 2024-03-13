// @ts-ignore
import prisma ,{UserCreateManyInput}  from "../DB/db.config";

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "Test User 1",
        email: "testuser1@example.com",
        password: "$2b$jsk24$kk2N",
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        images: "test-user-1.jpg",
        roles: "ADMIN",
        created_by: 0,
        updated_by: 0,
        Blogs: {
          create: [
            {
              title: "kapildham",
              content: "Best place to visit in kapilvatu",
              description: "awesome place ",
              category: "TECHNOLOGY",
              status: "Published",
              totalWord: 100,
              images: "blog_1.jpg",
              author: {
                connect: {
                  id: 1,
                },
              },
            },
            {
              title: "Lumbini",
              content: "Best place to visit in kapilvatu",
              description: "awesome place ",
              category: "TECHNOLOGY",
              status: "Published",
              totalWord: 100,
              images: "blog_2.jpg",
              author: {
                connect: {
                  id: 1,
                },
              },
            },
            {
              title: "bageshwor dham",
              content: "Best place to visit in kapilvatu",
              description: "awesome place ",
              category: "TECHNOLOGY",
              status: "Published",
              totalWord: 1,
              images: "blog_3.jpg",
              author: {
                connect: {
                  id: 1,
                },
              },
            },
          ],
        },
      },
      {
        id: 2,
        name: "Test User 2",
        email: "testuser2@example.com",
        password: "$2b$jsk24$kk2N",
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        images: "test-user-2.jpg",
        roles: "ADMIN",
        created_by: 0,
        updated_by: 0,
        Blogs: {
            create: [
            {
              title: "Nepal",
              content: "Best country to visit in the WORLD",
              description: "awesome country ",
              category: "Lifestyle",
              status: "Published",
              totalWord: 100,
              images: "blog_4.jpg",
              author: {
                connect: {
                  id: 2,
                },
              },
            },
          ],
        },
      },
      // Add more users if needed
    ] as UserCreateManyInput[],
  });

  console.log('Users seeded successfully.');

  await prisma.blog.createMany({
    data: [
      {
        id: 1,
        title: "kapildham",
        content: "Best place to visit in kapilvatu",
        description: "awesome place ",
        category: "TECHNOLOGY",
        status: "Published",
        totalWord: 100,
        images: "blog_1.jpg",
        author: "Test User 1",
      },
      {
        id: 2,
        title: "Nepal",
        content: "Best country to visit in the WORLD",
        description: "awesome country ",
        category: "Lifestyle",
        status: "Published",
        totalWord: 100,
        images: "blog_2.jpg",
        author: "Test User 2",
      },
      {
        id: 3,
        title: "Lumbini",
        content: "Best place to visit in kapilvatu",
        description: "awesome place ",
        category: "TECHNOLOGY",
        status: "Published",
        totalWord: 100,
        images: "blog_3.jpg",
        author: "Test User 1",
      },
      {
        id: 4,
        title: "bageshwor dham",
        content: "Best place to visit in kapilvatu",
        description: "awesome place ",
        category: "TECHNOLOGY",
        status: "Published",
        totalWord: 1,
        images: "blog_4.jpg",
        author: "Test User 1",
      },
    ],
  });

  console.log('Blogs seeded successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
