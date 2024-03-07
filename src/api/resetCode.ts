import { request } from ".";

const url = 'address/resetCode';

// Функция для сброса кода
const resetCode = async (flatId: string) => {
    const response = await request(url, { flatId });
    const code = response.data.code;
    return code;
};

export default resetCode;