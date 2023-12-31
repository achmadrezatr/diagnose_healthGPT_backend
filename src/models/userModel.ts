import { Schema, model, Document } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  token: string;
}

export interface IUserInputPassword extends IUser{
  passwordIsValid: string;
}


export interface ISendEmailOptions extends Document {
  email: string;
  subject: string;
  payload: unknown;
  template: string;
}


export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true , minlength: 6},
    token: {type: String, required: false} 
    },
    { timestamps: true }
    );

export const User = model<IUserDocument>("User", UserSchema);