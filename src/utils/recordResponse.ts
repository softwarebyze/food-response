import { Response } from "../types/Task";

export function recordResponse(response: Response) {
  console.table(response)
}
