'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ads', 'attributes', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    });

    // GIN index on JSONB column for fast containment queries (@>)
    await queryInterface.addIndex('ads', {
      fields: ['attributes'],
      using: 'gin',
      name: 'ads_attributes_gin_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('ads', 'ads_attributes_gin_idx');
    await queryInterface.removeColumn('ads', 'attributes');
  },
};
