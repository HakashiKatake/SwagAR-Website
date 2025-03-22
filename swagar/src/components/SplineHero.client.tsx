import Spline from '@splinetool/react-spline'

export default function Home() {
  return (
    <main className="relative flex items-center justify-center min-h-screen">
      {/* Spline Scene */}
      <Spline
        scene="https://prod.spline.design/tWewDz4HIqk6YFMc/scene.splinecode"
      />

      {/* Full-Width Black Overlay at Bottom */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-24       /* Adjust height as needed */
          bg-black
          z-[9999]   /* Large z-index to ensure it's above the watermark */
          pointer-events-none
        "
      >
        {/* Optional text or blank space */}
        <p className="text-white p-2">
          
        </p>
      </div>
    </main>
  );
}
