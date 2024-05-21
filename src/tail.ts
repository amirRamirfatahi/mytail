import { ProcessPool } from "./process-pool";

export async function tail(
  executioner: ProcessPool,
  input: { file: string; lines: number; keyword: string | undefined }
): Promise<string[]> {
  const { file, keyword, lines } = input;
  const { stdout, stderr } = await executioner.exec(
    `tail -n ${lines} ${file}${!!keyword ? ` | grep ${keyword}` : ""}`
  );
  if (!!stderr) {
    throw new Error(stderr);
  }
  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .reverse();
}
