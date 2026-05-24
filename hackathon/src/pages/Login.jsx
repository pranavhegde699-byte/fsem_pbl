import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { registerWorker, updateWorker, loginWorker, getWorker } from '../api/workers';
import { Check, Star, ArrowRight, Loader2, Link as LinkIcon } from 'lucide-react';

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry", "Chandigarh", "Ladakh"
];

const OCCUPATIONS = [
  { value: "street_vendor", label: "Street Vendor" },
  { value: "domestic_worker", label: "Domestic Worker" },
  { value: "construction", label: "Construction Worker" },
  { value: "driver", label: "Auto / Taxi Driver" },
  { value: "delivery", label: "Delivery Agent" },
  { value: "farmer", label: "Farmer / Agricultural" },
  { value: "migrant", label: "Migrant Worker" },
  { value: "other", label: "Other Informal Work" }
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    phone: '',
    state: '',
    occupation: '',
    years: '',
    gigPlatform: 'none',
    rating: 0
  });

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateProgress = () => {
    const required = isLoginMode 
      ? ['aadhaar', 'phone']
      : ['name', 'aadhaar', 'phone', 'state', 'occupation', 'years'];
    let filled = 0;
    required.forEach(field => {
      if (formData[field] && String(formData[field]).trim().length > 0) filled++;
    });
    return Math.round((filled / required.length) * 100);
  };

  const progress = calculateProgress();
  const isIdentityDone = isLoginMode 
    ? formData.aadhaar.replace(/\s/g, '').length === 12 && formData.phone.length === 10
    : formData.name.length >= 2 && formData.aadhaar.replace(/\s/g, '').length === 12 && formData.phone.length === 10;
  const isWorkDone = formData.state && formData.occupation && formData.years;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aadhaar') {
      let v = value.replace(/\D/g, '').substring(0, 12);
      let fmt = '';
      for (let i = 0; i < v.length; i++) {
        if (i > 0 && i % 4 === 0) fmt += '  ';
        fmt += v[i];
      }
      setFormData(prev => ({ ...prev, [name]: fmt }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRating = (r) => {
    setFormData(prev => ({ ...prev, rating: r }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (progress < 100) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        const loginRes = await loginWorker({
          aadhaar: formData.aadhaar.replace(/\s/g, ''),
          phone: formData.phone
        });
        const { token, worker } = loginRes.data;
        let profile = worker;
        try {
          const fresh = await getWorker(worker.id);
          profile = fresh.data;
        } catch {
          /* use login response if fetch fails */
        }
        login(
          worker.id,
          profile.name || profile.full_name || worker.name || 'Worker',
          token
        );
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        const regRes = await registerWorker({
          aadhaar: formData.aadhaar.replace(/\s/g, ''),
          phone: formData.phone,
          language: 'en',
          name: formData.name,
        });
        
        const { token, worker } = regRes.data;
        login(worker.id, formData.name, token);

        await updateWorker(worker.id, {
          name: formData.name,
          state: formData.state,
          occupation: formData.occupation,
          years_active: parseInt(formData.years),
          gig_platform: formData.gigPlatform,
          gig_rating: formData.rating > 0 ? formData.rating : undefined
        });

        toast.success('Profile created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || (isLoginMode ? 'Failed to log in' : 'Failed to create profile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-10 sticky top-0 z-50">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Star className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <div className="font-serif text-lg text-slate-900 leading-none font-bold">DIGNIFY</div>
              <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase leading-none mt-0.5">Financial Identity</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
             <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
               Profile
             </div>
             <ArrowRight className="w-3 h-3 text-slate-300"/>
             <div className="flex items-center text-xs font-bold text-slate-400">
               Upload
             </div>
          </div>

          <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm font-medium text-slate-500">
            {isLoginMode ? "Don't have a profile?" : "Have a profile?"} <span className="text-blue-600 font-bold border-b border-blue-600">{isLoginMode ? "Register" : "Login"}</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto pt-10 px-4">
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-md px-3 py-1 mb-4">
               <LinkIcon className="w-3 h-3 text-blue-600" />
               <span className="text-[10px] font-bold tracking-widest uppercase text-blue-700">{isLoginMode ? "Welcome Back" : "Create Your Profile"}</span>
            </div>
            <h1 className="font-serif text-4xl text-slate-900 leading-tight">
              {isLoginMode ? "Log In to Your Profile" : "Build Your Financial Identity"}
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
              {isLoginMode ? "Enter your secured credentials to access your WorkProof dashboard." : <span>Tell us about yourself — this becomes the foundation of your <em className="text-slate-700 not-italic font-bold">WorkProof Score</em> and scheme eligibility.</span>}
            </p>
          </div>
          <div className="shrink-0 md:text-right">
            <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">Completion</div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-blue-600 min-w-[30px]">{progress}%</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0 ${isIdentityDone ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                  {isIdentityDone ? <Check className="w-4 h-4" /> : '01'}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide uppercase text-slate-900">Identity</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your name and secure Aadhaar verification</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {!isLoginMode && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      Full Name <span className="text-rose-600 text-sm">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ramesh Kumar"
                      className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                    Aadhaar Number <span className="text-rose-600 text-sm">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    maxLength={16}
                    value={formData.aadhaar}
                    onChange={handleChange}
                    placeholder="XXXX  XXXX  XXXX"
                    className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none font-mono tracking-widest focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-md py-1.5 px-2.5 mt-1 w-fit">
                     <Check className="w-3.5 h-3.5 text-emerald-600" />
                     <span className="text-[11px] text-emerald-700 font-medium">Stored with one-way encryption — never shared</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                    Mobile Number <span className="text-rose-600 text-sm">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Work & Location Card */}
            {!isLoginMode && (
              <motion.div 
                 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                 className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0 ${isWorkDone ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {isWorkDone ? <Check className="w-4 h-4" /> : '02'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wide uppercase text-slate-900">Location & Work</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Where you work and what you do</p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      State <span className="text-rose-600 text-sm">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      Occupation <span className="text-rose-600 text-sm">*</span>
                    </label>
                    <select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select occupation</option>
                      {OCCUPATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      Years of Work <span className="text-rose-600 text-sm">*</span>
                    </label>
                    <input
                      type="number"
                      name="years"
                      min="0"
                      max="50"
                      placeholder="5"
                      value={formData.years}
                      onChange={handleChange}
                      className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500"> Gig Platform </label>
                    <select
                      name="gigPlatform"
                      value={formData.gigPlatform}
                      onChange={handleChange}
                      className="h-11 px-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                    >
                      <option value="none">None</option>
                      <option value="swiggy">Swiggy</option>
                      <option value="zomato">Zomato</option>
                      <option value="ola">Ola</option>
                      <option value="uber">Uber</option>
                      <option value="urban_company">Urban Company</option>
                      <option value="dunzo">Dunzo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {formData.gigPlatform && formData.gigPlatform !== 'none' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 mt-2">
                       <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500 block mb-2"> Your Platform Rating </label>
                       <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                               <button
                                 key={i}
                                 type="button"
                                 onClick={() => handleRating(i)}
                                 className={`p-1.5 rounded transition-colors ${formData.rating >= i ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                               >
                                 <Star className={`w-6 h-6 ${formData.rating >= i ? 'fill-current' : ''}`} />
                               </button>
                            ))}
                          </div>
                          <div className="text-xl font-bold text-slate-800">{formData.rating > 0 ? formData.rating.toFixed(1) : '—'}</div>
                          <div className="text-xs font-medium text-slate-400">out of 5.0</div>
                       </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <button
                onClick={handleSubmit}
                disabled={loading || progress < 100}
                className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-4 h-4 text-white fill-current" />}
                {loading ? 'Processing...' : (isLoginMode ? 'Log In' : 'Create My Profile')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                By continuing you agree to our <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>
              </p>
            </motion.div>
          </div>

          {/* Right Sidebar Info */}
          <motion.div 
             initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
             className="sticky top-20 flex flex-col gap-4"
          >
             <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-5 border-b border-slate-100">
                   <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">What you unlock</div>
                   <div className="font-serif text-xl">Your Financial Passport</div>
                </div>
                <div className="p-5 flex flex-col gap-3.5">
                   {[
                     "WorkProof Score (0–850) based on UPI history",
                     "Matched government scheme eligibility",
                     "Downloadable 1-page financial document",
                     "AI explanation in your language"
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                         <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                         </div>
                         <span className="text-sm font-medium text-slate-600 leading-snug">{item}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-900 rounded-2xl p-5 text-slate-300">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center border border-white/20">
                      <Star className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="text-[11px] font-bold tracking-widest uppercase text-white">Privacy First</div>
                </div>
                <div className="flex flex-col gap-2.5">
                   {["Aadhaar hashed — never stored raw", "Data never sold to third parties", "UPI PDF deleted after scoring"].map((priv, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                         <span className="text-[13px] leading-snug">{priv}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-between mt-2">
                <div>
                  <div className="text-sm font-bold text-slate-700">
                    {isLoginMode ? "Don't have a profile?" : "Already registered?"}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    {isLoginMode ? "Create a new account" : "Log in with Aadhaar + phone"}
                  </div>
                </div>
                <button 
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-sm font-bold text-blue-600 border-b-2 border-blue-200 hover:border-blue-600 transition-colors pb-0.5"
                >
                  {isLoginMode ? "Register" : "Login"} <ArrowRight className="inline w-3 h-3"/>
                </button>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
