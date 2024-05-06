import useApi from "../hooks/useApi.ts";
import { Names } from "../types/user.ts";

const url = "user/sendName";

const sendName = async (names: Names) => {
  const { request } = useApi();
  await request(url, names);
  return;
};

export default sendName;
