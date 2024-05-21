import * as http from "http";
import { parse } from "url";
import { config } from "./config";
import { ProcessPool } from "./process-pool";
import { tail } from "./tail";
import { HttpError } from "./util";
import { validateInput } from "./validate";

const processPool = new ProcessPool(10);

const tailController = async (req: http.IncomingMessage) => {
  const query = parse(req.url || "", true).query;
  const input = await validateInput(query);
  const { file, keyword, lines } = input;
  return await tail(processPool, {
    file,
    lines,
    keyword,
  });
};

const server = http.createServer(async (req, res) => {
  try {
    const logLines = await tailController(req);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ log: logLines }));
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.writeHead(error.statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
