import { Loader } from "./Loader";

export function LoadingScreen() {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}
