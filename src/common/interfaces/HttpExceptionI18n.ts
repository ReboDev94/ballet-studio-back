interface ExceptionWithI18n {
  key: string;
  args: Record<string, any>;
}

interface ExceptionDefault {
  statusCode: number;
  message: string;
  errror: string;
}

export type HttpExceptionI18n = ExceptionWithI18n & ExceptionDefault;
