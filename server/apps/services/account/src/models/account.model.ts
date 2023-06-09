import { Schema, model } from '@pihe-core/mongo-client';
import { IAccount } from '@pihe-server/common';

export const Types: IAccount.Type = {
  customer: 'CUSTOMER',
  administrator: 'ADMINISTRATOR',
};

export const AccountSchema = new Schema<IAccount.Account>(
  {
    phone_number: { type: String, required: true, unique: true },
    is_phone_verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    is_email_verified: { type: Boolean, default: false },
    name: { type: String, default: '' },
    avatar_url: { type: String, default: null },
    refreshToken: { type: String, default: null },
    roles: { type: [String], default: [] },
  },
  {
    timestamps: true,
    discriminatorKey: 'account_type',
  }
);
const AccountModel = model('Account', AccountSchema);

const CustomerModel = AccountModel.discriminator(
  Types.customer,
  new Schema<IAccount.Customer>({
    gender: { type: String, default: '' },
    social: [
      {
        _id: false,
        id: { type: String, default: null },
        type: { type: String, default: '' },
      },
    ],
  })
);

const AdministratorModel = AccountModel.discriminator(
  Types.administrator,
  new Schema<IAccount.Administrator>({})
);

export { AccountModel, CustomerModel, AdministratorModel };
