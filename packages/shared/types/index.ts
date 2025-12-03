export type ID = string;

export type User = {
  id: ID;
  email: string;
  name?: string;
  phone?: string;
  roles?: string[];
};

export type Role = {
  id: number;
  name: string;
  description?: string;
};
