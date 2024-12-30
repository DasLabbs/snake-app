export type JoinGameResponse = {
  id: string;
  userId: string;
  status: string;
  point: number;
};

export type FinishGamePayload = {
  gamePlayId: string;
  point: number;
  userId: string;
};

export type FinishGameResponse = {
  gamePlayId: string;
  userId: string;
  point: number;
  lastRegen: number;
};

export type LeaderBoardItem = {
  userEmail: string;
  highestPoint: number;
};

export type LeaderBoardResponse = LeaderBoardItem[];
