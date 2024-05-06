import { SettingsBoolean } from "../types/user";

const convertSettingsBoolean = (value?: SettingsBoolean): boolean => {
  return value === "t";
};

export default convertSettingsBoolean
