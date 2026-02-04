export interface TaskFilterParams {
  status: number | null;
  priority: number | null;
  category: number | null;
  searchTerm: string | null;
  dueDateFrom: string | null;
  dueDateTo: string | null;
  sortBy: string | null;
  sortDescending: boolean;
  pageNumber: number;
  pageSize: number;
}
