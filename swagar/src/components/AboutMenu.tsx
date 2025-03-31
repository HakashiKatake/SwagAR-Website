import FlowingMenu from "./FlowingMenu/FlowingMenu";

const demoItems = [
  { link: '#', text: 'Virtual', image: 'https://i.pinimg.com/736x/46/5f/da/465fdae0ede26b8728cc8291ecd93195.jpg' },
  { link: '#', text: 'Tryon', image: 'https://i.pinimg.com/736x/09/35/30/0935305b6c80bbcb8028829c38a162dd8.jpg' },
];

export default function AboutMenu() {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white p-8" style={{ minHeight: '600px' }}>
      {/* Flowing menu container */}
      <div className="w-full" style={{ height: '300px', position: 'relative' }}>
        <FlowingMenu items={demoItems} />
      </div>
      {/* About Us text section */}
      <div className="mt-8 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">About Swaggar</h2>
        <p className="text-lg mb-2">
          Swaggar is revolutionizing the fashion industry by merging cutting-edge technology with style. Our platform allows you to virtually try on clothes using advanced 3D models, AI-driven sizing, and augmented reality.
        </p>
        <p className="text-lg">
          We are committed to making shopping fun, interactive, and tailored to your personal style. With our innovative approach, you can see exactly how each piece fits and looks on you before making a purchase. Join us as we redefine the future of fashion!
        </p>
      </div>
    </div>
  );
}
