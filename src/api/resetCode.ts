import useApi from "../hooks/useApi";

const url = "address/resetCode";

// Функция для сброса кода
const resetCode = async (flatId: string) => {
  const { request } = useApi();
  const response = await request(url, { flatId });
  const code = response.data.code;
  return code;
};

export default resetCode;
