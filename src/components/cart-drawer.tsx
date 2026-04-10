"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, CheckCircle, ArrowRight, Truck, AlertCircle, LogIn } from "lucide-react";
import { useCart } from "@/lib/store/useCart";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { createOrder } from "@/lib/actions";
import { toast } from "sonner";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function validateField(name: string, value: string): string | undefined {
  switch (name) {
    case "name":
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters";
      return undefined;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
      return undefined;
    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!/^[+]?[\d\s()-]{10,}$/.test(value.replace(/\s/g, ""))) return "Please enter a valid 10-digit phone number";
      return undefined;
    case "address":
      if (!value.trim()) return "Shipping address is required";
      if (value.trim().length < 10) return "Please enter a complete address";
      return undefined;
    case "city":
      if (!value.trim()) return "City is required";
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "City can only contain letters";
      return undefined;
    case "state":
      if (!value.trim()) return "State is required";
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "State can only contain letters";
      return undefined;
    case "pincode":
      if (!value.trim()) return "Pincode is required";
      if (!/^\d{6}$/.test(value.trim())) return "Pincode must be 6 digits";
      return undefined;
    default:
      return undefined;
  }
}

function validateForm(data: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string }): FormErrors {
  const errors: FormErrors = {};
  Object.keys(data).forEach((key) => {
    const error = validateField(key, data[key as keyof typeof data]);
    if (error) errors[key as keyof FormErrors] = error;
  });
  return errors;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, isGuest } = useAuth();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Update email if user logs in
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep("cart"), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    setTouched({ name: true, email: true, phone: true, address: true, city: true, state: true, pincode: true });
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await createOrder({
      items,
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ''),
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      user_id: user?.id,
    });

    if (result.success) {
      setOrderId(result.orderId);
      setStep("success");
      clearCart();
      toast.success("Order confirmed successfully!");
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-neutral-900 border-t border-white/10 rounded-t-[2.5rem] z-[101] overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
              <h2 className="text-white font-cormorant-garamond text-3xl font-medium tracking-tight">
                {step === "cart" ? "My Collection" : step === "checkout" ? "Delivery Details" : "Order Confirmed"}
              </h2>
              <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {step === "cart" && (
                <div className="space-y-6">
                  {items.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <ShoppingBag size={48} className="mx-auto text-white/10" />
                      <p className="text-white/40 font-light text-lg">Your collection is empty.</p>
                      <Button onClick={onClose} variant="outline" className="rounded-full border-white/10 text-white">
                        Explore Perfumes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {item.originalPrice && item.originalPrice !== item.price ? (
                                <>
                                  <span className="text-white/30 text-sm line-through">₹{String(item.originalPrice).replace(/[^\d]/g, '')}</span>
                                  <span className="text-rose-400 text-sm font-medium">₹{String(item.price).replace(/[^\d]/g, '')}</span>
                                  {item.discountPercent && (
                                    <span className="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                      -{item.discountPercent}%
                                    </span>
                                  )}
                                </>
                              ) : (
                                <p className="text-white/40 text-sm">₹{String(item.price).replace(/[^\d]/g, '')}</p>
                              )}
                              {item.volume && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-white/10" />
                                  <span className="text-white/20 text-[10px] uppercase tracking-wider">{item.volume}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-white/20 hover:text-red-400 transition-colors p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "checkout" && (
                <div className="space-y-6">
                  {!user && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4">
                      <div>
                        <h4 className="text-white text-sm font-medium">Have an account?</h4>
                        <p className="text-white/40 text-xs mt-1">
                          Log in to save your shipping details and earn rewards.
                        </p>
                      </div>
                      <Link 
                        href="/login" 
                        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-colors"
                      >
                        <LogIn size={14} /> Log In
                      </Link>
                    </div>
                  )}

                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-3 mb-6">
                    <Truck className="text-white/40 mt-1" size={20} />
                    <div>
                      <h4 className="text-white text-sm font-medium">Direct Shipping Only</h4>
                      <p className="text-white/40 text-xs mt-1 leading-relaxed">
                        We currently only offer direct shipping to your doorstep. Please provide accurate details below.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-white/40 text-xs uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Ex: John Doe"
                        className={`w-full bg-white/5 border ${errors.name && touched.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/40 text-xs uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Ex: john@example.com"
                        className={`w-full bg-white/5 border ${errors.email && touched.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/40 text-xs uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      required 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Ex: +91 98765 43210"
                      className={`w-full bg-white/5 border ${errors.phone && touched.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/40 text-xs uppercase tracking-widest ml-1">Shipping Address</label>
                    <textarea 
                      required 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Street address, apartment, suite, etc."
                      rows={3}
                      className={`w-full bg-white/5 border ${errors.address && touched.address ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors resize-none`}
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-white/40 text-xs uppercase tracking-widest ml-1">City</label>
                      <input 
                        required 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="City"
                        className={`w-full bg-white/5 border ${errors.city && touched.city ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                      />
                      {errors.city && touched.city && (
                        <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/40 text-xs uppercase tracking-widest ml-1">State</label>
                      <input 
                        required 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="State"
                        className={`w-full bg-white/5 border ${errors.state && touched.state ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                      />
                      {errors.state && touched.state && (
                        <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.state}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-2">
                      <label className="text-white/40 text-xs uppercase tracking-widest ml-1">Pincode</label>
                      <input 
                        required 
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Pincode"
                        className={`w-full bg-white/5 border ${errors.pincode && touched.pincode ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors`}
                      />
                      {errors.pincode && touched.pincode && (
                        <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
                </div>
              )}

              {step === "success" && (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle size={40} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white text-2xl font-medium">Order Placed Successfully!</h3>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                      <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Your Order ID</p>
                      <p className="text-white text-2xl font-mono font-bold tracking-wider uppercase">
                        {orderId?.slice(0, 8)}
                      </p>
                      <p className="text-white/30 text-[10px] leading-relaxed">
                        Please save this ID for future reference. Our team will contact you shortly on your phone number to confirm the delivery.
                      </p>
                      <button 
                        onClick={() => {
                          if (orderId) navigator.clipboard.writeText(orderId.slice(0, 8).toUpperCase());
                          alert("Order ID copied to clipboard!");
                        }}
                        className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors pt-2"
                      >
                        Copy to Clipboard
                      </button>
                    </div>

                    <p className="text-white/40 font-light text-sm max-w-xs mx-auto">
                      Thank you for choosing Scentence.
                    </p>
                  </div>
                  <Button 
                    onClick={onClose} 
                    className="rounded-full bg-white text-black px-12 py-6 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>

            {step !== "success" && items.length > 0 && (
              <div className="p-8 md:p-10 bg-neutral-950 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-lg font-light">Subtotal</span>
                  <span className="text-white text-2xl font-medium">₹{totalPrice().toLocaleString()}</span>
                </div>
                
                {step === "cart" ? (
                  <Button 
                    onClick={() => setStep("checkout")}
                    className="w-full bg-white text-black hover:bg-neutral-200 rounded-full py-8 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Proceed to Delivery <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-neutral-200 rounded-full py-8 font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Order"} <CheckCircle size={16} />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
