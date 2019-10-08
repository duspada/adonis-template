'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table.string('username').unique();
      table.string('name');
      table.string('nickname');
      table.string('github');
      table.string('linkedin');
      table
        .string('email')
        .notNullable()
        .unique();
      table.string('password').notNullable();
      table
        .bool('active')
        .notNullable()
        .defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
