import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [size, setSize] = useState(256);
  const qrRef = useRef();

  const downloadQRCode = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Draw QR code onto temporary canvas
    const qrCanvas = qrRef.current.querySelector('canvas');
    ctx.drawImage(qrCanvas, 0, 0, size, size);

    // Draw logo in center if exists
    if (logo) {
      const logoImg = new Image();
      logoImg.src = logo;
      await new Promise((resolve) => {
        logoImg.onload = () => {
          const logoSize = size * 0.25;
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          resolve();
        };
      });
    }

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch("https://qr-code-creator-clean.onrender.com/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
      });
  
      const data = await response.json();
console.log("Stripe session response:", data);

if (data.id) {
  const stripe = await stripePromise;
  stripe.redirectToCheckout({ sessionId: data.id });
} else {
  alert("Error creating Stripe Checkout session");
}
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };  

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-72 p-2 border border-gray-300 rounded mb-4"
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2">
          Foreground:
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          Background:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          Size:
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border border-gray-300 rounded p-1"
          >
            <option value={128}>128x128</option>
            <option value={256}>256x256</option>
            <option value={512}>512x512</option>
          </select>
        </label>
      </div>

      <label className="mb-4">
        Upload Logo:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setLogo(reader.result);
              reader.readAsDataURL(file);
            }
          }}
          className="ml-2"
        />
      </label>

      {text && (
        <div className="relative my-6" ref={qrRef} style={{ width: size, height: size }}>
          <QRCodeCanvas value={text} size={size} fgColor={fgColor} bgColor={bgColor} />
          {logo && (
            <img
              src={logo}
              alt="logo"
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: size * 0.25,
                height: size * 0.25,
                transform: 'translate(-50%, -50%)',
                borderRadius: '8px',
              }}
            />
          )}
        </div>
      )}

      {text && (
        <>
          <button
            onClick={downloadQRCode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Download QR Code
          </button>

          <button
            onClick={handlePurchase}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Buy Premium QR Code
          </button>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
