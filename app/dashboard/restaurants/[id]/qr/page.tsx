'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';

interface QRInfo {
  restaurantId: string;
  restaurantName: string;
  menuUrl: string;
}

export default function QRCodePage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrInfo, setQRInfo] = useState<QRInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const generateQRCode = useCallback(async (url: string) => {
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, url, {
          errorCorrectionLevel: 'H' as const,
          margin: 1,
          width: 300,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      }
    } catch {
      setError('Failed to generate QR code');
    }
  }, []);

  const fetchQRInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/qr`);
      if (!res.ok) throw new Error('Failed to fetch QR code info');

      const data = await res.json();
      setQRInfo(data);
      await generateQRCode(data.menuUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, generateQRCode]);

  useEffect(() => {
    fetchQRInfo();
  }, [fetchQRInfo]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = `${qrInfo?.restaurantName}-menu-qr.png`;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrInfo) {
      try {
        await navigator.clipboard.writeText(qrInfo.menuUrl);
        alert('Link copied to clipboard!');
      } catch {
        alert('Failed to copy link');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading QR code...</p>
      </div>
    );
  }

  if (error || !qrInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Share Menu - {qrInfo.restaurantName}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* QR Code Section */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code</h2>
            <canvas
              ref={canvasRef}
              className="mb-6 border-2 border-gray-200 rounded"
            />
            <button
              onClick={downloadQRCode}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Download QR Code
            </button>
          </div>

          {/* Link Section */}
          <div className="flex flex-col justify-center bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Link</h2>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Share this link with customers:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInfo.menuUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">How to Use:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  ✓ <strong>QR Code:</strong> Print or display the QR code in your restaurant for customers to scan
                </li>
                <li>
                  ✓ <strong>Direct Link:</strong> Share the link via email, SMS, or social media
                </li>
                <li>
                  ✓ Customers can view your digital menu on any device without downloading an app
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Preview</h2>
          <a
            href={qrInfo.menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Open Menu in New Tab
          </a>
          <p className="text-gray-600 text-sm mt-4">
            This is what your customers will see when they access your menu
          </p>
        </div>
      </main>
    </div>
  );
}
