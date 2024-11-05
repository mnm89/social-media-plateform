"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("posts", [
      {
        userId: "11111111-1111-1111-1111-111111111111",
        title: "Exploring the San Francisco Tech Scene",
        content:
          "San Francisco is a hub for tech enthusiasts. Here's my take on the latest trends...",
        visibility: "public",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        title: "My Favorite Programming Languages",
        content:
          "I've worked with several languages over the years, but here are my top picks...",
        visibility: "friends-only",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        title: "Digital Art Tips for Beginners",
        content:
          "Creating art is my passion. Here are some tips for beginners to get started...",
        visibility: "public",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        title: "Exploring New York City’s Art Scene",
        content:
          "NYC is full of amazing galleries. Here are my favorite spots to visit...",
        visibility: "private",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        title: "Top Destinations for 2024",
        content:
          "I love traveling, and these destinations are on my list for 2024...",
        visibility: "public",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        title: "Marketing Trends to Watch",
        content:
          "As a marketing specialist, I always keep an eye on trends. Here’s what to expect...",
        visibility: "friends-only",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        title: "New Technologies I'm Excited About",
        content:
          "2024 is bringing some cool innovations in AI and machine learning...",
        visibility: "public",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        title: "Why I Love Working Remotely",
        content:
          "Remote work has changed the game for productivity and work-life balance...",
        visibility: "private",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        title: "My Top 5 Artistic Inspirations",
        content:
          "Here are some artists and creators who inspire me every day...",
        visibility: "public",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        title: "Best Places to Visit in Europe",
        content:
          "From Paris to Prague, these destinations are a must-visit for travelers...",
        visibility: "friends-only",
      },
      {
        userId: "22222222-2222-2222-2222-222222222222",
        title: "Color Theory in Digital Art",
        content:
          "Understanding color can make a huge difference in your art projects...",
        visibility: "public",
      },
      {
        userId: "11111111-1111-1111-1111-111111111111",
        title: "Top Programming Books of All Time",
        content:
          "Whether you're a beginner or a pro, these books are worth a read...",
        visibility: "friends-only",
      },
      {
        userId: "33333333-3333-3333-3333-333333333333",
        title: "Building a Travel Blog",
        content: "Sharing my journey of starting a travel blog from scratch...",
        visibility: "public",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
