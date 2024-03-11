import { request } from ".";
import { Names } from "../types/user";

const url = "user/sendName";

const sendName = async (names: Names) => {
  await request(url, names);
  return;
};

export default sendName;
