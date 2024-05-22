import { Schema, model, Document } from 'mongoose';

interface User extends Document {
  username: string;
  preferences: {
    favoriteGenres: string[];
    dislikedGenres: string[];
  };
  watchHistory: {
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }[];
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
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
  ]
});

export default model<User>('User', userSchema);
