'use client';

import { useEffect, useState } from 'react';

export default function RewardPage() {
    const [reward, setReward] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Define the handler
        const handleUnityMessage = (message: any) => {
            console.log('Received Unity Message:', message);

            // Parse if it's a string (common in some WebView implementations)
            let data = message;
            if (typeof message === 'string') {
                try {
                    data = JSON.parse(message);
                } catch (e) {
                    console.error('Failed to parse message:', e);
                }
            }

            if (data?.type === 'REWARD') {
                setReward(data.data || 'Special Coupon');
                setShowConfetti(true);
            }
        };

        // Attach to window
        window.onUnityMessage = handleUnityMessage;

        // Cleanup
        return () => {
            window.onUnityMessage = undefined;
        };
    }, []);

    // Simple CSS Confetti Implementation
    const Confetti = () => (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-fall"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-5%`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                >
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)],
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                </div>
            ))}
            <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {showConfetti && <Confetti />}

            {/* Main Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center transform transition-all duration-500 hover:scale-105">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
                        <span className="text-4xl">🎁</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                        {reward ? '축하합니다!' : '보상을 찾아보세요!'}
                    </h1>
                    <p className="text-white/80 text-lg">
                        {reward ? '숨겨진 쿠폰을 발견하셨습니다.' : 'AR 공간에서 풍선이나 비눗방울을 터뜨려보세요.'}
                    </p>
                </div>

                {reward && (
                    <div className="bg-white/20 rounded-xl p-6 mb-6 border border-white/10 animate-pulse-slow">
                        <p className="text-sm text-white/60 uppercase tracking-widest mb-1">COUPON CODE</p>
                        <p className="text-2xl font-mono font-bold text-white tracking-wider">{reward === 'balloon_popped' ? 'BALLOON-2025' : reward === 'bubble_popped' ? 'BUBBLE-2025' : 'AIRCTT-BONUS'}</p>
                    </div>
                )}

                <button
                    onClick={() => {
                        // Test button functionality
                        if (!reward) {
                            setReward('TEST-REWARD');
                            setShowConfetti(true);
                        } else {
                            window.location.reload();
                        }
                    }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    {reward ? '다시 찾기' : '테스트하기 (Dev)'}
                </button>
            </div>

            {/* CSS for Blob Animation */}
            <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
