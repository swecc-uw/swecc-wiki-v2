/* Mesocosm deck — Reveal bootstrap.
   16:9 canvas (1920x1080), top-aligned; content lives in an inner .stage that
   owns padding + layout (so it never fights Reveal's section display). */
Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 2.0,
  center: false,
  controls: true,
  controlsLayout: "edges",
  progress: true,
  hash: true,
  slideNumber: false,
  transition: "fade",
  transitionSpeed: "default",
  plugins: [RevealHighlight],
});
