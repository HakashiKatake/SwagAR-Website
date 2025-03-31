import FlowingMenu from "./FlowingMenu/FlowingMenu";



const demoItems = [
  { link: '#', text: 'Virtual', image: 'https://i.pinimg.com/736x/46/5f/da/465fdae0ede26b8728cc8291ecd93195.jpg' },
  { link: '#', text: 'Tryon', image: 'https://i.pinimg.com/736x/09/35/30/0935305b6c80bcb8028829c38a162dd8.jpg' },
 
];

export default function AboutMenu() {
  return (

<div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu items={demoItems} />
</div>

  );
}