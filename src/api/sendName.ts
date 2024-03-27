import { useApi } from "../hooks/useApi";
import { Names } from "../types/user";

const url = "user/sendName";

const sendName = async (names: Names) => {
  const {request} = useApi()
  await request(url, names);
  return;
};

export default sendName;
