export type MemberDto = {
  id: number;
  name: string;
  createDate: string;
  modifyDate: string;
};

export type MemberWithUsernameDto = MemberDto & {
  username: string;
};
