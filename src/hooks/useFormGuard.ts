import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface UseFormGuardProps {
  isDirty: boolean;
  onClose: () => void;
}

export function useFormGuard({ isDirty, onClose }: UseFormGuardProps) {
  const t = useTranslations("common");

  const handleAttemptClose = () => {
    if (isDirty) {
      const confirm = window.confirm(t("confirmDiscardChanges"));
      if (confirm) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return {
    preventClose: isDirty,
    handleAttemptClose,
  };
}
