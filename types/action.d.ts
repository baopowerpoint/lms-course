export interface CreateUserParams {
  clerkId: string;
  name: string;
  email: string;
  username: string;
  picture: string;
}

export interface UpdateUserParams extends CreateUserParams{
  path: string
}
