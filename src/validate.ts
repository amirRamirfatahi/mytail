import { stat } from "fs";
import { ParsedUrlQuery } from "querystring";
import { config } from "./config";
import { HttpError } from "./util";

async function validateFile(filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stat(filePath, (error, _) => {
      if (!!error) {
        reject(error);
      }
      resolve(true);
    });
  });
}

async function getFile(query: ParsedUrlQuery): Promise<string> {
  const filePath = query.file as string;
  if (filePath) {
    try {
      await validateFile(filePath);
    } catch (error: any) {
      throw new HttpError(404, "The specified file does not exist.");
    }
  }
  return "/var/log/" + (filePath || config.DEFAULT_FILE_PATH);
}

async function validateLines(lines: number): Promise<boolean> {
  if (Number.isNaN(lines) || lines < 1 || lines > config.MAX_LINES_COUNT) {
    return false;
  }
  return true;
}

async function getLines(query: ParsedUrlQuery): Promise<number> {
  const lines = parseInt(query.lines as string) || config.DEFAULT_LINE_COUNT;

  try {
    await validateLines(lines);
  } catch (error: any) {
    throw new HttpError(
      400,
      `lines is not valid. It should be a number between 1 and ${config.MAX_LINES_COUNT}`
    );
  }
  return lines;
}

async function validateKeyword(keyword: string): Promise<boolean> {
  return /^[a-zA-Z0-9@.:\/]*$/.test(keyword);
}

async function getKeyword(query: ParsedUrlQuery): Promise<string | undefined> {
  const keyword = query.keyword as string | undefined;
  if (keyword === undefined) {
    return undefined;
  }
  try {
    await validateKeyword(keyword);
  } catch (error: any) {
    throw new HttpError(
      400,
      "Keyword is invalid. You can only use alphanumeric characters and the following: @, ., /, :"
    );
  }
  return keyword;
}

export async function validateInput(
  queryObject: ParsedUrlQuery
): Promise<{ lines: number; file: string; keyword: string | undefined }> {
  const file = await getFile(queryObject);

  const lines = await getLines(queryObject);

  const keyword = await getKeyword(queryObject);

  return { file, keyword, lines };
}
