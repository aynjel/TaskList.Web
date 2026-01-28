import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { GlobalStore } from '../../../shared/store/global.store';
import { DashboardService } from '../services/dashboard.service';
import { TaskSummary } from './../models/task-summary.model';

type DashboardStateType = {
  taskSummary: TaskSummary | undefined;
};

const INITIAL_STATE: DashboardStateType = {
  taskSummary: undefined,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(INITIAL_STATE),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    dashboardService: inject(DashboardService),
    toastrService: inject(ToastrService),
    router: inject(Router),
  })),
  withMethods((store) => {
    const loadDashboardStats = store.globalStore.withApiState<void, TaskSummary>(() =>
      store.dashboardService.getDashboardStats().pipe(
        tap({
          next: (response) => {
            patchState(store, { taskSummary: response });
          },
          error: (error) => {
            console.error('Error loading dashboard statistics:', error);
          },
        }),
      ),
    );

    return {
      loadDashboardStats,
    };
  }),
);
