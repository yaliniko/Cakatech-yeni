import * as migration_20261009_182428_initial from './20261009_182428_initial';
import * as migration_20261011_092942_remove_robots_posts from './20261011_092942_remove_robots_posts';

export const migrations = [
  {
    up: migration_20261009_182428_initial.up,
    down: migration_20261009_182428_initial.down,
    name: '20261009_182428_initial',
  },
  {
    up: migration_20261011_092942_remove_robots_posts.up,
    down: migration_20261011_092942_remove_robots_posts.down,
    name: '20261011_092942_remove_robots_posts'
  },
];
