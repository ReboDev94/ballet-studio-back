export interface ResetPassword {
  token: string;
  expire: number;
}

export interface FullResetPassword extends ResetPassword {
  tokenEmail: string;
}
