import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import axiosClient from '../api/axiosClient';

export function useReview() {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const submitReview = useCallback(async (language, code) => {
    // Cancel any in-flight request to avoid stale responses overwriting fresh state
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await axiosClient.post(
        '/reviews',
        { language, code },
        { signal: controller.signal }
      );
      setResult(data.data);
      return data.data;
    } catch (err) {
    if (axios.isCancel(err) || err.name === 'CanceledError') return null;
      const message = err.response?.data?.message || 'Something went wrong analyzing your code.';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { result, isSubmitting, error, submitReview, setResult };
}