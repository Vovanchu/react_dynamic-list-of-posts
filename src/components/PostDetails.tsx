import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { usePosts } from './hooks/usePosts';
import { useComments } from './hooks/useComments';
import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';

type Props = {
  userId: number | null;
  selectedPostId: number | null;
};

export const PostDetails: React.FC<Props> = ({ userId, selectedPostId }) => {
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const { posts, loading: postsLoading } = usePosts(userId);
  const { comments: initialComments, loading: commentsLoading } =
    useComments(selectedPostId);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const post = posts.find(p => p.id === selectedPostId);

  // синхронізація коментарів при зміні selectedPostId
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  if (postsLoading || commentsLoading) {
    return <Loader />;
  }

  if (!post) {
    return <div>No post selected</div>;
  }

  const addComment = (newComment: Comment) => {
    setComments(prev => [...prev, newComment]);
  };

  const handleDelete = async (commentId: number) => {
    try {
      await client.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <div className="content">
      <h2>{post.title}</h2>
      <p>{post.body}</p>

      <div>
        <h3>Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="message is-small">
              <div className="message-header">
                <a href={`mailto:${comment.email}`}>{comment.name}</a>
                <button
                  className="delete"
                  aria-label="delete"
                  onClick={() => handleDelete(comment.id)}
                />
              </div>
              <div className="message-body">{comment.body}</div>
            </div>
          ))
        )}

        {!showNewCommentForm && (
          <button
            type="button"
            className="button is-link"
            onClick={() => setShowNewCommentForm(true)}
          >
            Write a comment
          </button>
        )}

        {showNewCommentForm && (
          <NewCommentForm postId={post.id} onAddComment={addComment} />
        )}
      </div>
    </div>
  );
};
