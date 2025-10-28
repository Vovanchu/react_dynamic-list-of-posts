// hooks/useComments.ts
import { useEffect, useState } from 'react';
import { client } from '../../utils/fetchClient';
import { Comment } from '../../types/Comment';

export const useComments = (postId: number | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      return;
    }

    setLoading(true);
    client
      .get<Comment[]>(`/comments?postId=${postId}`)
      .then(setComments)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  return { comments, loading, error };
};
