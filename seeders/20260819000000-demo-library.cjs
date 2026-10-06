'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Authors', [
      { name: 'Jose Rizal', email: 'rizal@library.test',
        createdAt: now, updatedAt: now },
      { name: 'Francisco Balagtas', email: 'balagtas@library.test',
        createdAt: now, updatedAt: now },
      { name: 'Anonymous', email: 'anon@library.test',
        createdAt: now, updatedAt: now }
    ]);

    const authors = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Authors";',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const idOf = (name) => authors.find((a) => a.name === name).id;

    await queryInterface.bulkInsert('Books', [
      { title: 'Noli Me Tangere',   available: true,
        authorId: idOf('Jose Rizal'), createdAt: now, updatedAt: now },
      { title: 'El Filibusterismo', available: true,
        authorId: idOf('Jose Rizal'), createdAt: now, updatedAt: now },
      { title: 'Florante at Laura', available: true,
        authorId: idOf('Francisco Balagtas'), createdAt: now, updatedAt: now },
      { title: 'Ibong Adarna',      available: false,
        authorId: idOf('Anonymous'), createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
