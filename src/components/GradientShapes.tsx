'use client';

// Abstract gradient shapes component using actual PNG assets
export default function GradientShapes() {
  // Available shape assets for future use
  // const shapes = [
  //   'SCR-20250916-oxza.png',
  //   'SCR-20250916-oxzt.png', 
  //   'SCR-20250916-oybi.png',
  //   'SCR-20250916-oybz.png',
  //   'SCR-20250916-oyco.png',
  //   'SCR-20250916-oyea.png',
  //   'SCR-20250916-oyfe.png'
  // ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Shape 1 */}
      <img
        src="/SCR-20250916-oxza.png"
        alt=""
        className="absolute opacity-60 mix-blend-mode-screen"
        style={{
          width: '200px',
          height: 'auto',
          top: '10%',
          left: '15%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Shape 2 */}
      <img
        src="/SCR-20250916-oxzt.png"
        alt=""
        className="absolute opacity-50 mix-blend-mode-screen"
        style={{
          width: '150px',
          height: 'auto',
          top: '20%',
          right: '20%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />
      
      {/* Shape 3 */}
      <img
        src="/SCR-20250916-oybi.png"
        alt=""
        className="absolute opacity-55 mix-blend-mode-screen"
        style={{
          width: '180px',
          height: 'auto',
          top: '60%',
          left: '10%',
          animation: 'float 7s ease-in-out infinite'
        }}
      />
      
      {/* Shape 4 */}
      <img
        src="/SCR-20250916-oybz.png"
        alt=""
        className="absolute opacity-45 mix-blend-mode-screen"
        style={{
          width: '120px',
          height: 'auto',
          top: '70%',
          right: '15%',
          animation: 'float 9s ease-in-out infinite reverse'
        }}
      />
      
      {/* Shape 5 */}
      <img
        src="/SCR-20250916-oyco.png"
        alt=""
        className="absolute opacity-65 mix-blend-mode-screen"
        style={{
          width: '160px',
          height: 'auto',
          top: '40%',
          left: '50%',
          animation: 'float 5s ease-in-out infinite'
        }}
      />
      
      {/* Shape 6 */}
      <img
        src="/SCR-20250916-oyea.png"
        alt=""
        className="absolute opacity-40 mix-blend-mode-screen"
        style={{
          width: '100px',
          height: 'auto',
          top: '80%',
          left: '60%',
          animation: 'float 10s ease-in-out infinite reverse'
        }}
      />
      
      {/* Shape 7 */}
      <img
        src="/SCR-20250916-oyfe.png"
        alt=""
        className="absolute opacity-50 mix-blend-mode-screen"
        style={{
          width: '140px',
          height: 'auto',
          top: '5%',
          right: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
