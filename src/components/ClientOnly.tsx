"use client";

import dynamic from "next/dynamic";
import React, { FC, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
}

const ClientOnly: FC<ClientOnlyProps> = ({ children }) => {
  return <>{children}</>;
};

export interface CircuitProps {
  onRun?: (result: any) => void;
  // add other props if Circuit accepts them
}

export interface BlochSphereProps {
  // If BlochSphere accepts props, list them here. Leave empty if none.
}

export interface AlgorithmsProps {
  onRun?: (result: any) => void;
  // add others if needed
}

/**
 * Dynamically imported BlochSphere component with SSR disabled
 * Cast to React.ComponentType<BlochSphereProps> so TS knows about props.
 */
export const BlochSphereNoSSR = dynamic(
  () => import("./BlochSphere").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
) as unknown as React.ComponentType<BlochSphereProps>;

/**
 * Dynamically imported Circuit component with SSR disabled
 */
export const CircuitNoSSR = dynamic(
  () => import("./circuit").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
) as unknown as React.ComponentType<CircuitProps>;

export const AlgorithmsNoSSR = dynamic(
  () => import("./Algorithms").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
) as unknown as React.ComponentType<AlgorithmsProps>;

export const ResultsNoSSR = dynamic(
  () => import("./Results").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div></div>,
  }
);

export default ClientOnly;
