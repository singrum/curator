import { User } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export type UserState = {
  user: User | null;
};

export type UserStore = UserState;

export const createUserStore = (initState: UserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
  }));
};
