/* Loading States Management */

export const loadingStates = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
};

export function useLoadingState(initialState = loadingStates.idle) {
  const [state, setState] = React.useState(initialState);

  const setLoading = () => setState(loadingStates.loading);
  const setSuccess = () => setState(loadingStates.success);
  const setError = () => setState(loadingStates.error);
  const reset = () => setState(loadingStates.idle);

  return { state, setLoading, setSuccess, setError, reset };
}

/* Smooth Loading Delay for Better UX */
export const LOADING_MIN_DURATION = 300; // Minimum time to show loading state

export async function withLoadingState(asyncFn, minDuration = LOADING_MIN_DURATION) {
  const startTime = Date.now();

  try {
    const result = await asyncFn();
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDuration - elapsedTime);

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    return result;
  } catch (error) {
    throw error;
  }
}
