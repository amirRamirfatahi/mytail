import { ProcessPool } from "../src/process-pool";

export async function echo(executioner: ProcessPool): Promise<string[]> {
  const { stdout, stderr } = await executioner.exec("echo Hello World");
  if (!!stderr) {
    throw new Error(stderr);
  }
  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .reverse();
}

test("Process is successfully executed and the output is returned", async () => {
  const pool = new ProcessPool(1);
  const res = await echo(pool);
  expect(res[0]).toEqual("Hello World");
});

test("Execution is enqueued when the queue is already full and processed when dequeued", async () => {
  const pool = new ProcessPool(2);
  const results = await Promise.all([echo(pool), echo(pool), echo(pool)]);
  results.forEach((res) => {
    expect(res[0]).toEqual("Hello World");
  });
});
