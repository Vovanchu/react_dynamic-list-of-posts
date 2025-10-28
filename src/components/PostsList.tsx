import React, { useEffect, useState } from 'react';
import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';
import { Loader } from './Loader';

type PostsListProps = {
  userId: number | null;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const PostsList: React.FC<PostsListProps> = ({
  userId,
  setSelectedPostId,
}) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activePostId, setActivePostId] = React.useState<number | null>(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      client
        .get<Post[]>(`/posts?userId=${userId}`)
        .then(posts => {
          setUserPosts(posts);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error fetching posts:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div data-cy="PostsList">
          {userPosts.length === 0 ? (
            <div className="notification is-warning" data-cy="NoPostsYet">
              No posts yet
            </div>
          ) : (
            <>
              <p className="title">Posts:</p>

              <table
                className="
            table 
            is-fullwidth 
            is-striped 
            is-hoverable 
            is-narrow
          "
              >
                <thead>
                  <tr className="has-background-link-light">
                    <th>#</th>
                    <th>Title</th>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <th> </th>
                  </tr>
                </thead>

                <tbody>
                  {userPosts.map(userPost => {
                    const isActive = activePostId === userPost.id;

                    return (
                      <tr data-cy="Post" key={userPost.id}>
                        <td data-cy="PostId">{userPost.id}</td>
                        <td data-cy="PostTitle">{userPost.title}</td>
                        <td className="has-text-right is-vcentered">
                          <button
                            type="button"
                            data-cy="PostButton"
                            className={`button is-link ${isActive ? '' : 'is-light'}`}
                            onClick={() => {
                              setActivePostId(isActive ? null : userPost.id);
                              setSelectedPostId(isActive ? null : userPost.id);
                            }}
                          >
                            {isActive ? 'Close' : 'Open'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </>
  );
};
