'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string>('');
    const [cameras, setCameras] = useState<any[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    // Prefer back camera on mobile
                    const backCamera = devices.find((device) =>
                        device.label.toLowerCase().includes('back')
                    );
                    setSelectedCamera(backCamera?.id || devices[0].id);
                } else {
                    setError('No cameras found on this device');
                }
            })
            .catch((err) => {
                setError('Unable to access camera. Please grant camera permissions.');
                console.error('Camera error:', err);
            });

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        if (!selectedCamera) {
            setError('No camera selected');
            return;
        }

        try {
            const scanner = new Html5Qrcode('barcode-reader');
            scannerRef.current = scanner;

            await scanner.start(
                selectedCamera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // Success callback
                    console.log('Barcode detected:', decodedText);
                    onScan(decodedText);
                    stopScanning();
                    onClose();
                },
                (errorMessage) => {
                    // Error callback (scanning in progress)
                    // This fires frequently, so we don't show it
                }
            );

            setIsScanning(true);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to start camera');
            console.error('Scanner start error:', err);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const handleClose = () => {
        stopScanning();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Scan Barcode</h2>
                <button
                    onClick={handleClose}
                    className="text-white hover:text-gray-300 text-2xl"
                >
                    ✕
                </button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {error ? (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4 max-w-md">
                        <p className="font-medium mb-2">⚠️ Error</p>
                        <p>{error}</p>
                    </div>
                ) : null}

                {/* Camera Selection */}
                {cameras.length > 1 && !isScanning && (
                    <div className="mb-4 w-full max-w-md">
                        <label className="block text-white mb-2">Select Camera:</label>
                        <select
                            value={selectedCamera}
                            onChange={(e) => setSelectedCamera(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600"
                        >
                            {cameras.map((camera) => (
                                <option key={camera.id} value={camera.id}>
                                    {camera.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Scanner Container */}
                <div
                    id="barcode-reader"
                    className="w-full max-w-md rounded-lg overflow-hidden"
                ></div>

                {/* Instructions */}
                <div className="mt-6 text-center text-white max-w-md">
                    <p className="text-lg mb-2">
                        {isScanning ? '📷 Scanning...' : '📱 Ready to scan'}
                    </p>
                    <p className="text-sm text-gray-400">
                        {isScanning
                            ? 'Point your camera at a barcode'
                            : 'Click the button below to start scanning'}
                    </p>
                </div>

                {/* Controls */}
                <div className="mt-6 flex gap-4">
                    {!isScanning ? (
                        <button
                            onClick={startScanning}
                            disabled={!selectedCamera || !!error}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Start Scanning
                        </button>
                    ) : (
                        <button
                            onClick={stopScanning}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                        >
                            Stop Scanning
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
