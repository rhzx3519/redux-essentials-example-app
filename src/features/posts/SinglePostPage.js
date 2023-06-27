import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ReactionButtons from './ReactionButtons';
import { selectPostById } from './postSlice';

export default function SinglePostPage({ match }) {
    const { postId } = match.params;

    const post = useSelector(state => selectPostById(state, postId));

    if (!post) {
        return (
            <section>
                <h2>页面未找到! </h2>
            </section>
        );
    }

    return (
        <section>
            <article className='post'>
                <h2>{post.title}</h2>
                <p className='post-content'>{post.content}</p>
                <Link to={`/editPost/${post.id}`} className='button'>
                    Edit Post
                </Link>
                <ReactionButtons post={post}/>
            </article>
        </section>
    )
}
