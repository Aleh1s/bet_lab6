import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    text: String,
    authorId: String,
});

export default mongoose.model('Post', PostSchema, 'posts');