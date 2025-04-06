import { useSession } from "next-auth/react";
import { LoadingScreen } from "./ui/LoaderScreen";
import AccessDenied from "./ui/AccessDenied";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    router.push("/login");
  }

  if (session.status === "loading") {
    return <LoadingScreen />
  }

  if (session.data?.user?.role === 'not_confirmed') {
    return <AccessDenied />
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthLayout;