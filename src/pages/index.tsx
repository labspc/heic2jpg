import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Download } from 'lucide-react';

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setJpgUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();
      setJpgUrl(result.jpgUrl);
    } catch (err) {
      setError('Error converting file. Please make sure it\'s a valid HEIC image.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">HEIC to JPG Converter</h1>
        <div className="mb-4">
          <label htmlFor="fileInput" className="block w-full cursor-pointer bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            <Upload className="inline-block mr-2" />
            Choose HEIC File
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".heic"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {isConverting && <p className="text-center">Converting...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {jpgUrl && (
          <div className="mt-4 space-y-4">
            <img src={jpgUrl} alt="Converted JPG" className="w-full rounded-lg mb-2" />
            <a
              href={jpgUrl}
              download={`${new Date().toISOString().slice(0, 10)}.jpg`}
              className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 text-center"
            >
              <Download className="inline-block mr-2" />
              Download JPG
            </a>
          </div>
        )}
        {!jpgUrl && !isConverting && (
          <div className="mt-4 flex items-center justify-center">
            <ImageIcon size={64} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}