'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Env = use('Env');

class Image extends Model {
  static get computed() {
    return ['url'];
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  getUrl({ path }) {
    return `${Env.get('FRONT_URL')}/images/${path}`;
  }
}

module.exports = Image;
