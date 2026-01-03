export const UserRole = {
  GENERAL: 0,
  EDITOR: 1,
  ADMIN: 2,
} as const;

export const UserRoleLabel: Record<number, string> = {
  [UserRole.GENERAL]: "일반",
  [UserRole.EDITOR]: "편집자",
  [UserRole.ADMIN]: "관리자",
};
