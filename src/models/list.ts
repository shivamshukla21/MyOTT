import { Schema, model, Document } from 'mongoose';

interface ListItem {
  itemId: string;
  itemType: 'movie' | 'tvshow';
}

interface List extends Document {
  userId: string;
  items: ListItem[];
}

const listSchema = new Schema<List>({
  userId: { type: String, required: true },
  items: [{ itemId: { type: String }, itemType: { type: String } }]
});

export default model<List>('List', listSchema);
