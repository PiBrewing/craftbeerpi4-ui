import { lazy, Suspense } from "react";

// The UI only draws scatter traces. The basic bundle (scatter, bar, pie) is a
// fraction of the full plotly.js and leaves out the map stack (maplibre-gl).
// It is loaded on first use, in its own chunk, rather than with the app.
const LazyPlot = lazy(() =>
  Promise.all([import("react-plotly.js/factory"), import("plotly.js-basic-dist-min")]).then(
    ([factory, Plotly]) => ({ default: factory.default(Plotly.default) })
  )
);

const Plot = (props) => (
  <Suspense fallback={null}>
    <LazyPlot {...props} />
  </Suspense>
);

export default Plot;
