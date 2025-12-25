import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Smartphone, Lock, EyeOff, MessageSquare, Truck, PackageCheck, ArrowLeft, HelpCircle, Activity, Zap } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0415] text-white">
      {/* Navigation */}
      <nav className="bg-[#0f0518]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-[#0B0415] rounded-full border border-white/10 p-2">
                    <Zap className="text-yellow-400" size={20} fill="#FAFF00" />
                </div>
             </div>
             <span className="font-black text-lg tracking-tight text-white">SEVENS 24/7</span>
          </Link>
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#0f0518] text-white py-32 px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <HelpCircle size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <ShieldCheck size={14} />
            Transparency Protocol
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
            Trust through <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Anonymous Verification.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            We've built a feedback loop that prioritizes customer privacy while giving sellers the critical data they need to improve safety and service.
          </p>
        </div>
      </section>

      {/* The Process Steps */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="space-y-24 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0B0415] bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <PackageCheck size={20} className="text-black"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1025]/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/5 hover:border-yellow-400/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-black text-white/5">01</span>
                        <h3 className="font-bold text-xl text-white uppercase tracking-wide">Dispatch & Trigger</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        When your order is packed and handed to the courier, our system generates a cryptographically unique "Delivery Token". This token allows one-time access to the review system.
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0B0415] bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Smartphone size={20} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1025]/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-black text-white/5">02</span>
                        <h3 className="font-bold text-xl text-white uppercase tracking-wide">Secure SMS Invite</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        You receive a text message with a secure link. This link is isolated from your medical records. The feedback platform knows <em>a</em> delivery happened, but not <em>what</em> items were inside.
                    </p>
                </div>
            </div>

             {/* Step 3 */}
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0B0415] bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <MessageSquare size={20} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1025]/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-black text-white/5">03</span>
                        <h3 className="font-bold text-xl text-white uppercase tracking-wide">Anonymous Review</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        You rate the <strong>Delivery Speed</strong>, <strong>Product Condition</strong>, and <strong>Service Quality</strong>. You can leave comments, but we strictly advise against sharing personal medical details.
                    </p>
                </div>
            </div>

             {/* Step 4 */}
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0B0415] bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Activity size={20} className="text-black"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1A1025]/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/5 hover:border-green-500/30 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-black text-white/5">04</span>
                        <h3 className="font-bold text-xl text-white uppercase tracking-wide">Aggregation & Insight</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        Once submitted, the link expires. Your data is scrubbed of digital fingerprints and aggregated into the seller's dashboard. Positive trends are celebrated; negative trends trigger service audits.
                    </p>
                </div>
            </div>

        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="bg-[#0f0518] py-32 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto bg-[#1A1025]/40 rounded-[2.5rem] p-8 md:p-12 border border-cyan-500/20 backdrop-blur-sm flex flex-col md:flex-row gap-12 items-center shadow-[0_0_50px_rgba(34,211,238,0.05)]">
            <div className="flex-shrink-0 bg-cyan-500/10 p-8 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <EyeOff size={64} className="text-cyan-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-wide">The Privacy Guarantee</h2>
                <p className="text-cyan-100 text-lg leading-relaxed mb-8 font-light">
                    SEVENS 24/7 is designed with a "Privacy-First" architecture. We do not store customer names, order details, or history on our feedback servers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 bg-[#0B0415] p-4 rounded-xl border border-white/5">
                        <ShieldCheck className="text-green-400" size={20} />
                        <span className="font-bold text-sm text-slate-300">No Personal Records</span>
                    </div>
                    <div className="flex items-center gap-4 bg-[#0B0415] p-4 rounded-xl border border-white/5">
                        <Lock className="text-purple-400" size={20} />
                        <span className="font-bold text-sm text-slate-300">End-to-End Encryption</span>
                    </div>
                    <div className="flex items-center gap-4 bg-[#0B0415] p-4 rounded-xl border border-white/5">
                        <Activity className="text-yellow-400" size={20} />
                        <span className="font-bold text-sm text-slate-300">Aggregated Reporting</span>
                    </div>
                    <div className="flex items-center gap-4 bg-[#0B0415] p-4 rounded-xl border border-white/5">
                        <Truck className="text-blue-400" size={20} />
                        <span className="font-bold text-sm text-slate-300">Decoupled Delivery Data</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-6">
            {[
                { q: "Is my feedback really anonymous?", a: "Yes. Once you submit, the link between your phone number and the review is permanently severed in the analytics view. The admin only sees that 'a user' submitted feedback, not 'who' submitted it." },
                { q: "What if I have a bad reaction to the product?", a: "This platform is for service and delivery feedback ONLY. If you are having a medical emergency or adverse reaction, please contact your doctor or emergency services (111) immediately." },
                { q: "Can I edit my review later?", a: "No. To ensure data integrity and prevent manipulation, reviews are locked once submitted. You would need to request a new review link for a subsequent order." },
                { q: "Does the delivery driver see my rating?", a: "Drivers receive aggregate scores (e.g., 'Your average rating is 4.8/5'), but they cannot see individual reviews or identify which customer left specific feedback." }
            ].map((item, idx) => (
                <div key={idx} className="bg-[#1A1025]/40 p-8 rounded-3xl shadow-lg border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="font-bold text-lg text-white mb-3">{item.q}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#08020F] py-16 px-6 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-8">Ready to improve the standard?</h2>
            <Link to="/" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 uppercase tracking-wide">
                Back to Home <ArrowLeft size={20} className="rotate-180"/>
            </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;