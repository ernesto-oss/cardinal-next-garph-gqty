import React from "react";
import dynamic from "next/dynamic";

const NonSSRWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
});
