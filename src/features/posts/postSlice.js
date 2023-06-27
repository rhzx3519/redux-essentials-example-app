import {createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { sub } from 'date-fns'

// const initialPosts = [
//   {
//     id: '1',
//     title: 'First Post!',
//     content: 'Hello!',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//         thumbsUp: 0,
//         hooray: 0,
//         heart: 0,
//         rocket: 0,
//         eyes: 0,
//     },
//   },
//   {
//     id: '2', title: 'Second Post!', content: 'More text', date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//         thumbsUp: 0,
//         hooray: 0,
//         heart: 0,
//         rocket: 0,
//         eyes: 0,
//     },
//   },
// ];

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
              state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
              return {
                payload: {
                  id: nanoid(),
                  date: new Date().toISOString(),
                  title,
                  content,
                  user: userId,
                  reactions: {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    eyes: 0,
                  },
                }
              }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.entities[id]
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
    },
    extraReducers(builder) {
      builder
        .addCase(fetchPosts.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.status = 'succeeded';
        // Add any fetched posts to the array
        // Use the `upsertMany` reducer as a mutating update utility
          postsAdapter.upsertMany(state, action.payload)
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
          .addCase(addNewPost.fulfilled, postsAdapter.addOne)
    },
});

// selectors
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts);


export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)

// thunk 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts');
    return response.data;
});

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async initialPost => {
        const response = await client.post('/fakeApi/posts', initialPost);
        return response.data;
    }
);


export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;