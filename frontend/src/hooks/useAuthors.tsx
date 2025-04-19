import { useState, useEffect } from 'react';
import { Author } from '../api/posts';
import { getAllAuthors, getAuthorById } from '../services/authors';

export function useAllAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        setLoading(true);
        const data = await getAllAuthors();
        setAuthors(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch authors'));
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();
  }, []);

  return { authors, loading, error };
}

export function useAuthor(id: string) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAuthor() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getAuthorById(id);
        setAuthor(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch author'));
      } finally {
        setLoading(false);
      }
    }

    fetchAuthor();
  }, [id]);

  return { author, loading, error };
}