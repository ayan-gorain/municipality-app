export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "worker";
  photo?: string;
}
