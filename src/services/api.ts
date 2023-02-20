import { VITE_URL } from "~/constants";

/**
 * Guardar codigo en base de datos
 * @param workspace
 * @param code
 * @returns
 */
export const apiSaveWorkspace = (workspace: string, code: string) => {
  return fetch(`${VITE_URL}/api/${workspace}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
};
