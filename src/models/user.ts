// src/models/user.ts
import { Schema, model, Document } from 'mongoose';

interface Favorite {
  itemId: string;
  itemType: string;
}

interface User extends Document {
  username: string;
  password: string;
  preferences: {
    favoriteGenres: string[];
    dislikedGenres: string[];
  };
  watchHistory: {
    contentId: string;  
    watchedOn: Date;
    rating?: number;
  }[];
  favorites: Favorite[];
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String }],
    dislikedGenres: [{ type: String }]
  },
  watchHistory: [
    {
      contentId: { type: String },
      watchedOn: { type: Date },
      rating: { type: Number }
    }
  ],
  favorites: [
    {
      itemId: { type: String },
      itemType: { type: String }
    }
  ]
});

export default model<User>('User', userSchema);
