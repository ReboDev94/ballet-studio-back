export interface IRollCall {
  id: number;
  date: string;
  attended: boolean;
  studentId: number;
  studentName: string;
}

export interface IListRollCall {
  studentId: number;
  studentName: string;
  percentage: number;
  rollCall: Partial<IRollCall>[];
}
