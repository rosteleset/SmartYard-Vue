import { ref } from "vue";
import { useLocale } from "../hooks/locale";

const useEventNames = () => {
  const { t } = useLocale();

  const eventNames = ref<{ [key: string]: string }>({
    "1": t("events.call_unanswered"),
    "2": t("events.call_answered"),
    "3": t("events.open_by_key"),
    "4": t("events.open_from_app"),
    "5": t("events.open_by_face"),
    "6": t("events.open_by_code"),
    "7": t("events.open_gates_by_call"),
    default: t("events.unknown"),
  });

  return {
    eventNames,
  };
};

export default useEventNames;
