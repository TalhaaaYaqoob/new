import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
            footerActionLink: 'text-emerald-600 hover:text-emerald-700'
          }
        }}
      />
    </div>
  );
}