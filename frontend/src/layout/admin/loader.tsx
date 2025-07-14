// components/BigCenterLoader.tsx

import { ClipLoader } from "react-spinners";

interface BigCenterLoaderProps {
  size?: number;
  message?: string;
}

const BigCenterLoader = ({ size = 50, message }: BigCenterLoaderProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[200px] py-8 gap-3">
      <ClipLoader
        size={size}
        color="var(--tw-text-primary)"
        speedMultiplier={1}
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default BigCenterLoader;
