import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div class="relative flex min-h-screen flex-col items-center justify-center pb-4 pt-10 font-sans md:pb-0 md:pt-0">
      <div className="fixed inset-0 z-0">
        <img
          alt="sign-in"
          loading="lazy"
          decoding="async"
          class="pointer-events-none absolute inset-0 object-cover object-center absolute w-full h-full"
          src="https://dashboard.clerk.com/assets/signin-bg.svg"
          style={{
            inset: " 0px",
            color: "transparent",
          }}
        />
      </div>

      <SignIn />
    </div>
  );
}
