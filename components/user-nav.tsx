import { UserButton } from "@clerk/nextjs";

export function UserNav() {
  return (
    <div className="flex items-center gap-4">
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-10 h-10"
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
}