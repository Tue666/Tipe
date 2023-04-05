import { Schema, model } from '@pihe-core/mongo-client';

export const UserSchema = new Schema({
  user_name: {
    type: String,
  },
});

export const UserModel = model('User', UserSchema);
