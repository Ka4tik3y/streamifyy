import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min=h-screen flex justify-center items-center ">
      <LoaderIcon className=" animate-spin size-10" />
    </div>
  );
};

export default PageLoader;
