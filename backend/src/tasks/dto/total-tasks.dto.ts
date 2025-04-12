import { Task } from '../entity/tasks.entity';

export type TotalTasksDto = {
  total: number;
  data: Task[];
};
