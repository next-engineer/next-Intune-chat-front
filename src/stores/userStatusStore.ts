import { create } from "zustand";
import { UserStatus } from "../types/websocket.types";

interface UserStatusState {
  users: UserStatus[];
  setUsers: (users: UserStatus[]) => void;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
}

export const useUserStatusStore = create<UserStatusState>((set, get) => ({
  users: [],

  setUsers: (users) => set({ users }),

  updateUserStatus: (userId, isOnline) => set((state) => ({
    users: state.users.map((user) =>
      user.userId === userId
        ? { ...user, isOnline, lastSeen: isOnline ? undefined : new Date() }
        : user
    ),
  })),

  getUserStatus: (userId) => get().users.find((user) => user.userId === userId),
})); 