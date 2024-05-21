const {
  SERVER_PORT = "5000",
  DEFAULT_LINE_COUNT = "10",
  DEFAULT_FILE_PATH = "syslog",
  MAX_LINES_COUNT = 10000,
} = process.env;

export interface config {
  PORT: number;
  DEFAULT_LINE_COUNT: number;
  DEFAULT_FILE_PATH: string;
  MAX_LINES_COUNT: number;
}
export const config: config = {
  PORT: Number(SERVER_PORT),
  DEFAULT_LINE_COUNT: Number(DEFAULT_LINE_COUNT),
  DEFAULT_FILE_PATH: DEFAULT_FILE_PATH,
  MAX_LINES_COUNT: Number(MAX_LINES_COUNT),
};
