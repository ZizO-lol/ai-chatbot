import { signOut } from "@/lib/auth";

export const SignOutForm = () => {
  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut({ redirectTo: "/" });
  };

  return (
    <form onSubmit={handleSignOut} className="w-full">
      <button
        className="w-full px-1 py-0.5 text-left text-red-500"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
};
