import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ _id: false })
class EmailConfirmation {
  @Prop({
    required: true,
    type: String,
  })
  confirmationCode: string;

  @Prop({
    required: true,
    type: Date,
  })
  expirationDate: Date;

  @Prop({
    required: true,
    type: Boolean,
  })
  isConfirmed: boolean;
}
const userEmailConfirmSchema = SchemaFactory.createForClass(EmailConfirmation);
@Schema({ _id: false })
class AccountData {
  @Prop({
    required: true,
    type: String,
  })
  login: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  passwordHash: string;

  @Prop({
    required: true,
    type: Date,
  })
  createdAt: Date;
}
const userAccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ type: userAccountDataSchema })
  accountData: AccountData;

  @Prop({ type: userEmailConfirmSchema })
  emailConfirmation: EmailConfirmation;
}
export const UserSchema = SchemaFactory.createForClass(User);
