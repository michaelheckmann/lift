import { auth } from "src/config/firebase";

type Methods = "POST" | "PATCH";

/**
 * This function is used to sync the local state with the remote database.
 * It takes an endpoint, a method, and a body, and returns a boolean
 * @param {string} endpoint - The endpoint you want to hit on the backend.
 * @param {Methods} method - The HTTP method to use.
 * @param {T} body - The body of the request.
 * @returns A boolean indicating whether the transaction was successful or not.
 */
export async function updateRemoteState<T>(
  endpoint: string,
  method: Methods,
  body: T
) {
  const user = auth?.currentUser;
  if (!user) return;

  console.log(endpoint, method, body);

  const token = await user.getIdToken();
  // console.log("🚀 ~ file: dbSync.ts ~ line 22 ~ token", token);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  return fetch(`https://block.ceto.live/api/${endpoint}`, options)
    .then((res) => {
      // console.log("RES", res);
      return res.status < 400;
    })
    .catch((err) => {
      console.log("🚀 ~ file: sendToBackend.ts ~ line 38 ~ err", err);
      return false;
    });
}
