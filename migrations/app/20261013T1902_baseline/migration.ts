#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1f51a30316e260eae40b62c69811eaa82520dfcf5c89fdd714275b093888e24c/contract';
import endContract from '../../snapshots/1f51a30316e260eae40b62c69811eaa82520dfcf5c89fdd714275b093888e24c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Post',
        columns: [
          col('author', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('category', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
