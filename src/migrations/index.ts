import * as migration_20260610_120323_initial from './20260610_120323_initial';
import * as migration_20260610_182916_service_pages from './20260610_182916_service_pages';
import * as migration_20260611_071402_blog from './20260611_071402_blog';

export const migrations = [
  {
    up: migration_20260610_120323_initial.up,
    down: migration_20260610_120323_initial.down,
    name: '20260610_120323_initial',
  },
  {
    up: migration_20260610_182916_service_pages.up,
    down: migration_20260610_182916_service_pages.down,
    name: '20260610_182916_service_pages',
  },
  {
    up: migration_20260611_071402_blog.up,
    down: migration_20260611_071402_blog.down,
    name: '20260611_071402_blog'
  },
];
