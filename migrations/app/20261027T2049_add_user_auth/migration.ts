#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2b10e91e06d2e38e2405429381f78ae59c8a6efd70c3d322b2122536e23e62d5/contract';
import endContract from '../../snapshots/2b10e91e06d2e38e2405429381f78ae59c8a6efd70c3d322b2122536e23e62d5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9791e8d019214684ff5e5f51791029ea61c417f14a62cb231d2546cb96f6ee14/contract';
import startContract from '../../snapshots/9791e8d019214684ff5e5f51791029ea61c417f14a62cb231d2546cb96f6ee14/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Post', column: 'author' }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('authorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
