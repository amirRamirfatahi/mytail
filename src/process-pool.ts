import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface CommandQueueItem {
  command: string;
  resolve: (value: { stdout: string; stderr: string }) => void;
  reject: (reason?: any) => void;
}

export class ProcessPool {
  private maxSize: number;
  private pool: number;
  private queue: CommandQueueItem[];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.pool = 0;
    this.queue = [];
  }

  public async exec(
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    if (this.pool < this.maxSize) {
      try {
        this.pool += 1;
        const result = await execAsync(command);
        return result;
      } catch (error: any) {
        return { stdout: "", stderr: error };
      } finally {
        this.pool -= 1;
        this.runNext();
      }
    } else {
      return new Promise((resolve, reject) => {
        this.queue.push({ command, resolve, reject });
      });
    }
  }

  private runNext(): void {
    if (this.queue.length > 0) {
      const { command, resolve, reject } = this.queue.shift()!;
      this.exec(command).then(resolve).catch(reject);
    }
  }
}
