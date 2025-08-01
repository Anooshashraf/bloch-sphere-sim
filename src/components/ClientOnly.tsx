// "use client";

// import dynamic from "next/dynamic";
// import { FC, ReactNode } from "react";

// interface ClientOnlyProps {
//   children: ReactNode;
// }

// const ClientOnly: FC<ClientOnlyProps> = ({ children }) => <>{children}</>;

// export const BlochSphereNoSSR = dynamic(() => import("./BlochSphere"), {
//   ssr: false,
// });
// export const CircuitNoSSR = dynamic(() => import("./circuit"), { ssr: false });

// export default ClientOnly;
"use client";

import dynamic from "next/dynamic";
import { FC, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * ClientOnly component that ensures children are only rendered on the client side.
 * Useful for components that depend on browser APIs or should not be server-rendered.
 */
const ClientOnly: FC<ClientOnlyProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Dynamically imported BlochSphere component with SSR disabled
 */
export const BlochSphereNoSSR = dynamic(
  () => import("./BlochSphere").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
);

/**
 * Dynamically imported Circuit component with SSR disabled
 */
export const CircuitNoSSR = dynamic(
  () => import("./circuit").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
);

export default ClientOnly;
