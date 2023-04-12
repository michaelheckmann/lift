import fetch from "cross-fetch";
import { auth } from "src/config/firebase";

type Methods = "POST" | "PATCH";

export function updateRemoteState<T>(
  endpoint: string,
  method: "POST",
  body: T
): Promise<boolean>;
export function updateRemoteState<T>(
  endpoint: string,
  method: "PATCH",
  body: Omit<T, "id">
): Promise<boolean>;

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
  // Console log this value to populate the process.env.CUSTOM_ID_TOKEN variable
  // console.log("userIdToken", token);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  return fetch(`http://lift.ceto.live/api/${endpoint}`, options)
    .then(async (res) => {
      // console.log("RES STATUS", res.status);
      // console.log("RES MESSAGE", await res.text());
      return res.status < 400;
    })
    .catch((err) => {
      console.log("🚀 ~ file: dbSync.ts ~ line 38 ~ err", err);
      return false;
    });
}
