import { IUser, IUserDocument, User } from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const createUser = async ({
    email,
    password
}:IUser): Promise<IUserDocument> => {
    try {
        const user: IUserDocument = new User({
            email,
            password
        });

        //generate token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '1d'});
        user.token = token;
        await user.save();
        return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred'); 
            }
        }
    }

    export const findByEmail = async (email: string): Promise<IUserDocument | null> => {
        try {
            const user  = await User.findOne({email});
            if(user){
                return user;
            }
            return null
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred'); 
            }        
        }
    }

    