#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1f51a30316e260eae40b62c69811eaa82520dfcf5c89fdd714275b093888e24c/contract';
import startContract from '../../snapshots/1f51a30316e260eae40b62c69811eaa82520dfcf5c89fdd714275b093888e24c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5b15281a3f149ffa1741abaa75790218a2ad197d098a8bf2d235d66f649fb14f/contract';
import endContract from '../../snapshots/5b15281a3f149ffa1741abaa75790218a2ad197d098a8bf2d235d66f649fb14f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Post', column: 'category' }),
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
