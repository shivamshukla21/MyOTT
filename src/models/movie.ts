import { Schema, model, Document } from 'mongoose';

interface Movie extends Document {
  title: string;
  description: string;
  genres: string[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

const movieSchema = new Schema<Movie>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String, required: true }],
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: [{ type: String, required: true }]
});

export default model<Movie>('Movie', movieSchema);
