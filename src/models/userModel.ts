import { Schema, model, } from "mongoose";
import { IUserDocument } from "../@types/interfaces.js";
import bcrypt from "bcryptjs";


const UserSchema = new Schema<IUserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    },
    { timestamps: true }
    );

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hash = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT));
  this.password = hash;
  next();
})

export const User = model<IUserDocument>("User", UserSchema);