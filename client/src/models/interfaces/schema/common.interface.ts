import { AccountSchema } from './schema.interface';

export interface MetaSchema {
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
}

export interface TimestampsSchema {
  created_at: Date;
  updated_at: Date;
}

export interface SoftDeleteSchema {
  deleted_at: Date;
  deleted_by: {
    _id: AccountSchema['_id'];
    name: string;
  };
}
