#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5b15281a3f149ffa1741abaa75790218a2ad197d098a8bf2d235d66f649fb14f/contract';
import startContract from '../../snapshots/5b15281a3f149ffa1741abaa75790218a2ad197d098a8bf2d235d66f649fb14f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9791e8d019214684ff5e5f51791029ea61c417f14a62cb231d2546cb96f6ee14/contract';
import endContract from '../../snapshots/9791e8d019214684ff5e5f51791029ea61c417f14a62cb231d2546cb96f6ee14/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hashPassword', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
