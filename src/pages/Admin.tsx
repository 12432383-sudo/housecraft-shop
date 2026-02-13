import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff,
  LogOut, Settings, Package, User, Save, Loader2, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Layout from '@/components/layout/Layout';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { SizeImageUploader } from '@/components/admin/SizeImageUploader';
import { PasswordStrengthIndicator } from '@/components/admin/PasswordStrengthIndicator';
import { useProducts } from '@/contexts/ProductContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product, categoryLabels, ProductCategory, ProductSize } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';

const emptyProduct = {
  name: '',
  nameAr: '',
  description: '',
  descriptionAr: '',
  price: undefined as number | undefined,
  showPrice: true,
  category: 'candle' as ProductCategory,
  images: [] as string[],
  sizeImage: undefined as string | undefined,
  sizeType: 'one-size' as 'one-size' | 'multiple',
  sizes: [] as ProductSize[],
  customNotes: '',
  customNotesAr: '',
  isVisible: true,
  featured: false,
};

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { user, isAdmin, signOut } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ ...emptyProduct });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [sizeInput, setSizeInput] = useState('');

  // Settings state
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber);
  const [instagramInput, setInstagramInput] = useState(settings.instagramAccount);

  // Account state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setWhatsappInput(settings.whatsappNumber);
    setInstagramInput(settings.instagramAccount);
  }, [settings]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="section-padding text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              Your account (<strong>{user?.email || 'Guest'}</strong>) is not on the Admin whitelist.
            </p>
            <div className="text-sm text-left bg-white p-4 rounded border mb-4">
              <p className="font-semibold mb-2">To fix this:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Make sure you signed up with the correct email.</li>
                <li>Verify your email if Supabase sent you a link.</li>
                <li>Contact the developer to add this email to the whitelist.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/auth')}>Try Different Account</Button>
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const openNewProductDialog = () => {
    setEditingProduct(null);
    setFormData({ ...emptyProduct });
    setSizeInput('');
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr || '',
      description: product.description,
      descriptionAr: product.descriptionAr || '',
      price: product.price,
      showPrice: product.showPrice,
      category: product.category,
      images: [...product.images],
      sizeImage: product.sizeImage,
      sizeType: product.sizeType,
      sizes: [...product.sizes],
      customNotes: product.customNotes || '',
      customNotesAr: product.customNotesAr || '',
      isVisible: product.isVisible,
      featured: product.featured,
    });
    setSizeInput('');
    setIsDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Please enter a product name', variant: 'destructive' });
      return;
    }
    if (formData.images.length === 0) {
      toast({ title: 'Please add at least one image', variant: 'destructive' });
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast({ title: 'Product updated successfully!' });
    } else {
      addProduct(formData);
      toast({ title: 'Product added successfully!' });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setDeleteTarget(null);
    toast({ title: 'Product deleted' });
  };

  const handleSaveSettings = async () => {
    await updateSettings({
      whatsappNumber: whatsappInput,
      instagramAccount: instagramInput,
    });
    toast({ title: 'Settings saved successfully!' });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { name: sizeInput.trim() }],
      }));
      setSizeInput('');
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="mb-8">
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold">
                  Products ({products.length})
                </h2>
                <Button onClick={openNewProductDialog} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              <div className="space-y-4">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="card-elegant rounded-lg p-4 flex items-center gap-4"
                  >
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        {product.featured && (
                          <Badge variant="secondary" className="shrink-0 text-xs">Featured</Badge>
                        )}
                        {!product.isVisible && (
                          <Badge variant="outline" className="shrink-0 text-xs">Hidden</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {categoryLabels[product.category]?.en} •{' '}
                        {product.showPrice && product.price ? `$${product.price}` : 'Contact for price'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateProduct(product.id, { isVisible: !product.isVisible })}
                        title={product.isVisible ? 'Hide product' : 'Show product'}
                      >
                        {product.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateProduct(product.id, { featured: !product.featured })}
                        title={product.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {product.featured ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditProductDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No products yet. Add your first product!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-lg space-y-6">
                <h2 className="text-xl font-serif font-semibold">Store Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      placeholder="71101056"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the number without + or spaces (e.g., 1234567890)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Account</Label>
                    <Input
                      id="instagram"
                      value={instagramInput}
                      onChange={(e) => setInstagramInput(e.target.value)}
                      placeholder="thecrafthouse"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your Instagram username without @
                    </p>
                  </div>
                  <Button onClick={handleSaveSettings} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="max-w-lg space-y-6">
                <h2 className="text-xl font-serif font-semibold">Account Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <PasswordStrengthIndicator password={newPassword} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Product Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the product details below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Images */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <ImageUploader
                    images={formData.images}
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  />
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Name (English)</Label>
                    <Input
                      id="productName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productNameAr">Name (Arabic)</Label>
                    <Input
                      id="productNameAr"
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder="اسم المنتج"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDescription">Description (English)</Label>
                  <Textarea
                    id="productDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productDescriptionAr">Description (Arabic)</Label>
                  <Textarea
                    id="productDescriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="وصف المنتج..."
                    dir="rtl"
                    rows={3}
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProductCategory }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label.en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Price ($)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        price: e.target.value ? Number(e.target.value) : undefined,
                      }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Show Price */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.showPrice}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showPrice: checked }))}
                  />
                  <Label>Show price on product card</Label>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <Label>Size Type</Label>
                  <Select
                    value={formData.sizeType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, sizeType: value as 'one-size' | 'multiple' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-size">One Size</SelectItem>
                      <SelectItem value="multiple">Multiple Sizes</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.sizeType === 'multiple' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          placeholder="Size name (e.g., Small)"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        />
                        <Button type="button" variant="outline" onClick={addSize}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, i) => (
                          <Badge key={i} variant="secondary" className="gap-1 pr-1">
                            {size.name}
                            <button
                              type="button"
                              onClick={() => removeSize(i)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Size Chart Image */}
                <div className="space-y-2">
                  <Label>Size Chart Image (optional)</Label>
                  <SizeImageUploader
                    image={formData.sizeImage}
                    onImageChange={(image) => setFormData(prev => ({ ...prev, sizeImage: image }))}
                  />
                </div>

                {/* Custom Notes */}
                <div className="space-y-2">
                  <Label htmlFor="customNotes">Custom Notes (English)</Label>
                  <Textarea
                    id="customNotes"
                    value={formData.customNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, customNotes: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customNotesAr">Custom Notes (Arabic)</Label>
                  <Textarea
                    id="customNotesAr"
                    value={formData.customNotesAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, customNotesAr: e.target.value }))}
                    placeholder="ملاحظات إضافية..."
                    dir="rtl"
                    rows={2}
                  />
                </div>

                {/* Visibility & Featured */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                    />
                    <Label>Visible</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveProduct}>
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this product? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteTarget && handleDeleteProduct(deleteTarget)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
