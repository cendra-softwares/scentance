"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Image as ImageIcon,
  Loader2,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions";
import { validateImageFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ProductsDashboardProps {
  initialProducts: Product[];
}

export function ProductsDashboard({ initialProducts }: ProductsDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    const result = await deleteProduct(id);
    if (result.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else if ('error' in result) {
      alert("Error: " + result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Collection</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage your fragrance library and stock.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-6 py-6 font-bold uppercase tracking-widest text-[10px]"
        >
          <Plus size={16} className="mr-2" /> Add New Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 h-12 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Product</th>
                <th className="hidden md:table-cell px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</th>
                <th className="hidden md:table-cell px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Volume</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Price</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-white leading-tight">{product.name}</span>
                        <span className="text-[10px] text-zinc-400 mt-1 line-clamp-1 max-w-[200px]">{product.notes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-4">
                    <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-4">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      {product.volume ? (product.volume.toLowerCase().includes('ml') ? product.volume : `${product.volume} ml`) : "—"}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {product.discount_percent && product.discount_percent > 0 ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 dark:text-white">
                            ₹{Math.round(parseFloat(product.price.replace(/,/g, '')) * (1 - (product.discount_percent / 100)))}
                          </span>
                          <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded">
                            -{product.discount_percent}%
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400 line-through">
                          {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setIsEditing(product)}
                        className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || isEditing) && (
          <ProductForm 
            product={isEditing} 
            onClose={() => { setIsAdding(false); setIsEditing(null); }}
            onSave={(updatedProduct) => {
              if (isEditing) {
                setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
              } else {
                setProducts(prev => [...prev, updatedProduct]);
              }
              setIsAdding(false);
              setIsEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductForm({ product, onClose, onSave }: { 
  product: Product | null, 
  onClose: () => void,
  onSave: (product: Product) => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "Original",
    notes: product?.notes || "",
    price: product?.price || "",
    volume: product?.volume || "",
    image: product?.image || "",
    discount_percent: product?.discount_percent || null,
    top_note: product?.top_note || "",
    middle_note: product?.middle_note || "",
    bottom_note: product?.bottom_note || "",
    fragrance_type: product?.fragrance_type || "",
    product_type: product?.product_type || "",
    strength: product?.strength || "",
    sustainable: product?.sustainable || "",
    preferences: product?.preferences || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const originalPrice = parseFloat(formData.price.replace(/,/g, '')) || 0;
  const discountPercent = formData.discount_percent;

  const calculateFromPercent = (percent: number) => {
    const amount = originalPrice * (percent / 100);
    const discounted = originalPrice - amount;
    return { amount, discounted };
  };

  const calculateFromDiscounted = (discounted: number) => {
    const amount = originalPrice - discounted;
    const percent = originalPrice > 0 ? (amount / originalPrice) * 100 : 0;
    return { percent, amount };
  };

  const calculateFromAmount = (amount: number) => {
    const percent = originalPrice > 0 ? (amount / originalPrice) * 100 : 0;
    const discounted = originalPrice - amount;
    return { percent, discounted };
  };

  const getDiscountInfo = () => {
    if (!discountPercent || originalPrice <= 0) return null;
    const { amount, discounted } = calculateFromPercent(discountPercent);
    return { amount, discounted };
  };

  const discountInfo = getDiscountInfo();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      // Sanitize extension — only allow known image extensions
      const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(rawExt) ? rawExt : 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${safeExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Normalize price and volume by removing symbols if present
    const normalizedData = {
      ...formData,
      price: formData.price.trim().replace(/[₹,]/g, '').trim(),
      volume: formData.volume.trim().replace(/ml/gi, '').trim(),
      discount_percent: formData.discount_percent ?? 0,
    };

    try {
      if (product) {
        const result = await updateProduct(product.id, normalizedData);
        if (result.success && 'product' in result) onSave(result.product);
        else if (!result.success && 'error' in result) alert(result.error);
      } else {
        const result = await createProduct(normalizedData);
        if (result.success && 'product' in result) onSave(result.product);
        else if (!result.success && 'error' in result) alert(result.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fragrance Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. Amber Oud"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Original">Original</option>
                <option value="7A Master Copy">7A Master Copy</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Price</label>
              <input 
                required
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. 4,500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Volume (ml)</label>
              <input 
                required
                value={formData.volume}
                onChange={e => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. 100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Discount (%)</label>
              <input 
                type="number"
                min="0"
                max="99"
                value={formData.discount_percent ?? ""}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "") {
                    setFormData(prev => ({ ...prev, discount_percent: null }));
                  } else {
                    const percent = parseFloat(val) || 0;
                    setFormData(prev => ({ ...prev, discount_percent: percent }));
                  }
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. 17"
              />
              {discountInfo && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Save ₹{Math.round(discountInfo.amount)} → Final: ₹{Math.round(discountInfo.discounted)}
                </p>
              )}
            </div>
            {formData.price && parseFloat(formData.price.replace(/,/g, '')) > 0 && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Discounted Price (₹)</label>
                  <input 
                    type="number"
                    min="0"
                    defaultValue={discountInfo ? Math.round(discountInfo.discounted) : ""}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === "") {
                        setFormData(prev => ({ ...prev, discount_percent: null }));
                      } else {
                        const discounted = parseFloat(val) || 0;
                        const { percent, amount } = calculateFromDiscounted(discounted);
                        setFormData(prev => ({ ...prev, discount_percent: Math.round(percent * 10) / 10 }));
                      }
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. 1500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Discount Amount (₹)</label>
                  <input 
                    type="number"
                    min="0"
                    defaultValue={discountInfo ? Math.round(discountInfo.amount) : ""}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === "") {
                        setFormData(prev => ({ ...prev, discount_percent: null }));
                      } else {
                        const amount = parseFloat(val) || 0;
                        const { percent, discounted } = calculateFromAmount(amount);
                        setFormData(prev => ({ ...prev, discount_percent: Math.round(percent * 10) / 10 }));
                      }
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. 400"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fragrance Notes / Description</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              placeholder="Describe the scent profile..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Product Specifications</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Top Note</label>
                <input 
                  value={formData.top_note}
                  onChange={e => setFormData(prev => ({ ...prev, top_note: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Amber"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Middle Note</label>
                <input 
                  value={formData.middle_note}
                  onChange={e => setFormData(prev => ({ ...prev, middle_note: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Musk"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Bottom Note</label>
                <input 
                  value={formData.bottom_note}
                  onChange={e => setFormData(prev => ({ ...prev, bottom_note: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Vanilla"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Fragrance Type</label>
                <input 
                  value={formData.fragrance_type}
                  onChange={e => setFormData(prev => ({ ...prev, fragrance_type: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Oriental"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Type</label>
                <input 
                  value={formData.product_type}
                  onChange={e => setFormData(prev => ({ ...prev, product_type: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Eau de Parfum"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Strength</label>
                <input 
                  value={formData.strength}
                  onChange={e => setFormData(prev => ({ ...prev, strength: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Sustainable</label>
                <input 
                  value={formData.sustainable}
                  onChange={e => setFormData(prev => ({ ...prev, sustainable: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Regular"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-zinc-400 uppercase">Preferences</label>
                <input 
                  value={formData.preferences}
                  onChange={e => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Cruelty-Free"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Product Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex-shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon size={28} className="text-zinc-300" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-500 mb-3">Upload a high-quality image (max 5MB, JPG/PNG/WebP).</p>
                <input 
                  type="file" 
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="image-upload" 
                />
                <label 
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                >
                  Change Image
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 flex-shrink-0">
            <Button 
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl py-4 md:py-6 font-bold uppercase tracking-widest text-[10px] border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving || isUploading || !formData.image}
              className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl py-4 md:py-6 font-bold uppercase tracking-widest text-[10px]"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}