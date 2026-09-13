export type Status =
  | "Completed"
  | "Pending"
  | "Processing"
  | "Cancelled"
  | "Active"
  | "Invited"
  | "In stock"
  | "Low stock";
export interface RecordItem {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: Status;
  product: string;
  avatar: string;
}
export type Theme = "dark" | "light";
export interface Notification {
  id: number;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}
