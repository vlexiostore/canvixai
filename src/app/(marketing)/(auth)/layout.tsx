export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex bg-white text-black">
            {/* Left Side - Artistic Vector/Gradient area */}
            <div className="hidden lg:flex w-1/2 relative bg-[#0A0A0B] items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[100px] animate-pulse-glow" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-violet/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 text-center p-12">
                    <h2 className="font-display font-bold text-5xl text-white mb-6">Ignite your <br /> Creativity</h2>
                    <p className="text-white/50 text-lg max-w-md mx-auto">
                        Join the community of 2M+ creators building the future with Canvix.
                    </p>

                    {/* Abstract Vector Representation */}
                    <div className="mt-12 relative w-64 h-64 mx-auto">
                        <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-4 border-2 border-brand-orange/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-8 border-2 border-brand-violet/30 rounded-full animate-[spin_8s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
