import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Smartphone, Lock, EyeOff, MessageSquare, Truck, PackageCheck, ArrowLeft, HelpCircle, Activity } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Pill className="text-white" size={20} />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-xl">CustomerSuccess</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
            <HelpCircle size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-teal-400">
            <ShieldCheck size={14} />
            Transparency Protocol
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Trust through <br /><span className="text-teal-400">Anonymous Verification.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            We've built a feedback loop that prioritizes customer privacy while giving sellers the critical data they need to improve safety and service.
          </p>
        </div>
      </section>

      {/* The Process Steps */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <PackageCheck size={18} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-slate-100">01</span>
                        <h3 className="font-bold text-xl text-slate-800">Dispatch & Trigger</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        When your order is packed and handed to the courier, our system generates a cryptographically unique "Delivery Token". This token allows one-time access to the review system.
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Smartphone size={18} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-slate-100">02</span>
                        <h3 className="font-bold text-xl text-slate-800">Secure SMS Invite</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        You receive a text message with a secure link. This link is isolated from your medical records. The feedback platform knows <em>a</em> delivery happened, but not <em>what</em> items were inside.
                    </p>
                </div>
            </div>

             {/* Step 3 */}
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <MessageSquare size={18} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-slate-100">03</span>
                        <h3 className="font-bold text-xl text-slate-800">Anonymous Review</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        You rate the <strong>Delivery Speed</strong>, <strong>Product Condition</strong>, and <strong>Service Quality</strong>. You can leave comments, but we strictly advise against sharing personal medical details.
                    </p>
                </div>
            </div>

             {/* Step 4 */}
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Activity size={18} className="text-white"/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl font-black text-slate-100">04</span>
                        <h3 className="font-bold text-xl text-slate-800">Aggregation & Insight</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        Once submitted, the link expires. Your data is scrubbed of digital fingerprints and aggregated into the seller's dashboard. Positive trends are celebrated; negative trends trigger service audits.
                    </p>
                </div>
            </div>

        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="bg-teal-900 text-teal-50 py-24 px-6">
        <div className="max-w-4xl mx-auto bg-teal-800/50 rounded-[2.5rem] p-8 md:p-12 border border-teal-700 backdrop-blur-sm flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-shrink-0 bg-teal-500/20 p-8 rounded-full">
                <EyeOff size={64} className="text-teal-300" />
            </div>
            <div>
                <h2 className="text-3xl font-black mb-4 text-white">The Privacy Guarantee</h2>
                <p className="text-teal-100 text-lg leading-relaxed mb-8">
                    CustomerSuccess is designed with a "Privacy-First" architecture. We do not store customer names, order details, or history on our feedback servers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-teal-300" size={20} />
                        <span className="font-bold text-sm">No Personal Records Stored</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Lock className="text-teal-300" size={20} />
                        <span className="font-bold text-sm">End-to-End Encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className="text-teal-300" size={20} />
                        <span className="font-bold text-sm">Aggregated Reporting Only</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Truck className="text-teal-300" size={20} />
                        <span className="font-bold text-sm">Decoupled Delivery Data</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-6">
            {[
                { q: "Is my feedback really anonymous?", a: "Yes. Once you submit, the link between your phone number and the review is permanently severed in the analytics view. The admin only sees that 'a user' submitted feedback, not 'who' submitted it." },
                { q: "What if I have a bad reaction to the product?", a: "This platform is for service and delivery feedback ONLY. If you are having a medical emergency or adverse reaction, please contact your doctor or emergency services (111) immediately." },
                { q: "Can I edit my review later?", a: "No. To ensure data integrity and prevent manipulation, reviews are locked once submitted. You would need to request a new review link for a subsequent order." },
                { q: "Does the delivery driver see my rating?", a: "Drivers receive aggregate scores (e.g., 'Your average rating is 4.8/5'), but they cannot see individual reviews or identify which customer left specific feedback." }
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-3">{item.q}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-12 px-6 border-t border-slate-200 text-center">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Ready to improve the standard?</h2>
            <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Back to Home <ArrowLeft size={20} className="rotate-180"/>
            </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;