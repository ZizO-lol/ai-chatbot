import { LoaderIcon } from "@/components/icons";

import { Button } from "./ui/button";

export function SubmitButton({
  children,
  isSuccessful,
  isPending = false,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
  isPending?: boolean;
}) {
  return (
    <Button
      aria-disabled={isPending || isSuccessful}
      className="relative"
      disabled={isPending || isSuccessful}
      type={isPending ? "button" : "submit"}
    >
      {children}

      {(isPending || isSuccessful) && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {isPending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
