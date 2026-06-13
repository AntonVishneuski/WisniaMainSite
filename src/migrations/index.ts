import * as migration_20260610_120323_initial from './20260610_120323_initial';
import * as migration_20260610_182916_service_pages from './20260610_182916_service_pages';
import * as migration_20260611_071402_blog from './20260611_071402_blog';
import * as migration_20260613_211639_hero_price_from from './20260613_211639_hero_price_from';
import * as migration_20260613_000000_meta_pixel from './20260613_000000_meta_pixel';

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
    name: '20260611_071402_blog',
  },
  {
    up: migration_20260613_211639_hero_price_from.up,
    down: migration_20260613_211639_hero_price_from.down,
    name: '20260613_211639_hero_price_from'
  },
  {
    up: migration_20260613_000000_meta_pixel.up,
    down: migration_20260613_000000_meta_pixel.down,
    name: '20260613_000000_meta_pixel'
  },
];
