import { AccountSchema } from './schema.interface';

export interface MetaSchema {
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
}

export interface TimestampsSchema {
  created_at: string;
  updated_at: string;
}

export interface SoftDeleteSchema {
  deleted_at: string;
  deleted_by: {
    _id: AccountSchema['_id'];
    name: string;
  };
}
