import mongoose from 'mongoose';

export type UserInputType = {
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type AccountDataType = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};
type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type UserSchemaType = {
  _id: mongoose.Types.ObjectId;
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type UserViewType = {
  id: mongoose.Types.ObjectId;
  login: string;
};
