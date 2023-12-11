import { Dayjs } from "dayjs";

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ScheduleTime {
  id: string;
  start: string;
  end: string;
  error?: boolean;
}

export type ScheduleType = "anytime" | "specific" | "recurring";

export type RecurringSchedule = Record<Day, ScheduleTime[] | null>;

export interface SpecificSchedule {
  day: Dayjs;
  times: ScheduleTime[];
}

export interface PostSchedule {
  type: ScheduleType;
  payload?: RecurringSchedule | SpecificSchedule;
}

export type Category = "money" | "people" | "goods" | "other";

export interface NewPost {
  description: string;
  title: string;
  categories: Category[];
  locations: string[];
  schedule: PostSchedule;
}

export interface Post extends NewPost {
  id: string;
  created_by: string;
  created_at: Date;
}
