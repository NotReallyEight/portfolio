import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { type ClientOnErrorFunction } from "react-router";

const onError: ClientOnErrorFunction = (error, { location, errorInfo }) => {
  console.error(error, location, errorInfo);
};

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter onError={onError} />
    </StrictMode>
  );
});
