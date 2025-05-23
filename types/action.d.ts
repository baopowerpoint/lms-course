export interface CreateUserParams {
  clerkId: string;
  name: string;
  email: string;
  username: string;
  picture: string;
}

export interface UpdateUserParams extends CreateUserParams {
  path: string;
}

export interface CreateOrderParams {
  items: string[];
  total: number;
  paymentMethod: "bank_transfer" | "momo";
}
