import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query";

// Define our single API slice object
export const apiSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery(
        {baseUrl: '/fakeApi'}
    ),
    endpoints: builder => ({
        // The `getPosts` endpoint is a "query" operation that returns data
        getPosts: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/posts'
        }),
        getPost: builder.query({
            query: postId => `/posts/${postId}`
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: initialPost,
            })
        })
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } = apiSlice