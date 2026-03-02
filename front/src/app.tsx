import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <script
            defer
            src="https://analytics.aapelix.dev/script.js"
            data-website-id="4dbbf058-bef0-4a42-9033-3b8add6b0116"
          ></script>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
