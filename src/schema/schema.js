import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import Post from '../models/post.js';
import Author from '../models/author.js';

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            }
        }
    }),
});


const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({authorId: parent.id});
            }
        }
    })
});

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },
        createPost: {
            type: PostType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                text: { type: new GraphQLNonNull(GraphQLString) },
                authorId: {type: GraphQLID },
            },
            resolve(parent, args) {
                const post = new Post({
                    title: args.title,
                    text: args.text,
                    authorId: args.authorId,
                });
                return post.save();
            }
        },

        updateAuthor: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID},
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Author.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true }
                );
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: GraphQLID},
                title: { type: new GraphQLNonNull(GraphQLString) },
                text: {type: new GraphQLNonNull(GraphQLString) },
                authorId: {type: GraphQLID},
            },
            resolve(parent, args) {
                return Post.findByIdAndUpdate(
                    args.id,
                    { $set: { title: args.title, text: args.text, authorId: args.authorId } },
                    { new: true }
                );
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findByIdAndDelete(args.id);
            }
        },
        deletePost: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findByIdAndDelete(args.id);
            }
        },
    }
})

export default new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
