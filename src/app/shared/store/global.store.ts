import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

export type WithCallbacks<T, S> = {
  data: T;
  onSuccess?: (response: S) => void;
  onError?: (error: any) => void;
};

type GlobalStore = {
  isSubmitting: boolean;
  isLoading: boolean;
};

const initialState: GlobalStore = {
  isSubmitting: false,
  isLoading: false,
};

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    withFormSubmission<T, S>(source$: (source: T) => Observable<S>) {
      return rxMethod<WithCallbacks<T, S>>(
        pipe(
          tap(() => patchState(store, { isSubmitting: true })),
          debounceTime(300),
          switchMap((cb) =>
            source$(cb.data).pipe(
              tap({
                next: (response) => {
                  cb.onSuccess?.(response);
                },
                error: (error) => {
                  cb.onError?.(error);
                },
              }),
              finalize(() => {
                patchState(store, { isSubmitting: false });
              }),
            ),
          ),
        ),
      );
    },
    withApiState<T, S>(source$: (data: T) => Observable<S>) {
      return rxMethod<T>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((data) =>
            source$(data).pipe(finalize(() => patchState(store, { isLoading: false }))),
          ),
        ),
      );
    },
  })),
);
