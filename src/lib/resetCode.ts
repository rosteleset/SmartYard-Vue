import useApi from "../hooks/useApi.ts";

const url = "address/resetCode";

// Функция для сброса кода
const resetCode = async (flatId: string) => {
  const { request } = useApi();
  const response = await request(url, { flatId });
  return response.data.code;
};

export default resetCode;
