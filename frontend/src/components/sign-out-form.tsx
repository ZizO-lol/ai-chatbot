import { signOut } from "@/lib/auth";

export const SignOutForm = () => {
  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut({ redirectTo: "/" });
  };

  return (
    <form className="w-full" onSubmit={handleSignOut}>
      <button
        className="w-full px-1 py-0.5 text-left text-red-500"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
};
