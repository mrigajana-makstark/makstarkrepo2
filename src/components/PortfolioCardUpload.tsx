import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Save, Eye, X, Plus, Calendar, MapPin, User, Trash2, Edit2, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/apiConfig';

interface PortfolioCard {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  client: string;
  date: string;
  location: string;
  details: string;
  gallery: string[];
  tags: string[];
}

interface PortfolioCardUploadProps {
  onPublishCard?: (card: PortfolioCard) => void;
}

export function PortfolioCardUpload({ onPublishCard }: PortfolioCardUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    client: '',
    date: '',
    location: '',
    details: '',
    tags: '',
    coverImage: '',
    additionalImages: [] as string[]
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<'cover' | 'additional' | null>(null);
  const [uploadedCards, setUploadedCards] = useState<PortfolioCard[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showManagement, setShowManagement] = useState(false);

  const categories = [
    'Weddings',
    'Events', 
    'Films',
    'Branding',
    'Merchandise'
  ];

  // Load uploaded cards on mount
  useEffect(() => {
    const saved = localStorage.getItem('customPortfolioCards');
    if (saved) {
      setUploadedCards(JSON.parse(saved));
    }
  }, []);

  // Listen for custom card events
  useEffect(() => {
    const handleCardAdded = () => {
      const saved = localStorage.getItem('customPortfolioCards');
      if (saved) {
        setUploadedCards(JSON.parse(saved));
      }
    };

    window.addEventListener('customCardAdded', handleCardAdded);
    return () => window.removeEventListener('customCardAdded', handleCardAdded);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type: 'cover' | 'additional') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        // Show loading toast
        const toastId = toast.loading('Uploading image to ImageKit...');
        
        // Convert to base64 and upload
        const reader = new FileReader();
        reader.onload = async (event: any) => {
          const base64 = event.target.result;
          
          try {
            // Upload to backend which will handle ImageKit upload
            const response = await fetch(API_ENDPOINTS.upload.base64Image, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: base64,
                filename: file.name,
                folder: 'portfolio'
              })
            });
            
            if (!response.ok) {
              throw new Error('Upload failed');
            }
            
            const result = await response.json();
            const imageUrl = result.data.url;
            
            if (type === 'cover') {
              setFormData(prev => ({ ...prev, coverImage: imageUrl }));
              toast.success('Cover image uploaded to ImageKit!', { id: toastId });
            } else {
              setFormData(prev => ({
                ...prev,
                additionalImages: [...prev.additionalImages, imageUrl]
              }));
              toast.success('Additional image uploaded to ImageKit!', { id: toastId });
            }
          } catch (error) {
            console.error('ImageKit upload error:', error);
            toast.error('Failed to upload image to ImageKit', { id: toastId });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handlePublish = () => {
    // Validate required fields
    if (!formData.title || !formData.category || !formData.description || !formData.coverImage) {
      toast.error('Please fill in all required fields and upload a cover image');
      return;
    }

    const newCard: PortfolioCard = {
      id: editingId || Date.now(),
      title: formData.title,
      category: formData.category,
      image: formData.coverImage,
      description: formData.description,
      client: formData.client || 'N/A',
      date: formData.date || new Date().toLocaleDateString(),
      location: formData.location || 'N/A',
      details: formData.details || formData.description,
      gallery: [formData.coverImage, ...formData.additionalImages],
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    };

    let updatedCards = [...uploadedCards];
    if (editingId) {
      updatedCards = updatedCards.map(card => card.id === editingId ? newCard : card);
      toast.success('Portfolio card updated successfully!');
    } else {
      updatedCards.push(newCard);
      toast.success('Portfolio card published successfully!');
    }

    // Save to localStorage
    localStorage.setItem('customPortfolioCards', JSON.stringify(updatedCards));
    setUploadedCards(updatedCards);
    
    // Dispatch event with a small delay to ensure state is updated
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customCardAdded', { 
        detail: { card: newCard, action: editingId ? 'update' : 'create' }
      }));
    }, 100);

    if (onPublishCard) {
      onPublishCard(newCard);
    }

    // Reset form
    setFormData({
      title: '',
      category: '',
      description: '',
      client: '',
      date: '',
      location: '',
      details: '',
      tags: '',
      coverImage: '',
      additionalImages: []
    });
    setEditingId(null);
    setPreviewMode(false);
  };

  const handleEdit = (card: PortfolioCard) => {
    setFormData({
      title: card.title,
      category: card.category,
      description: card.description,
      client: card.client,
      date: card.date,
      location: card.location,
      details: card.details,
      tags: card.tags.join(', '),
      coverImage: card.image,
      additionalImages: card.gallery.slice(1)
    });
    setEditingId(card.id);
    setShowManagement(false);
  };

  const handleDelete = (id: number) => {
    const updatedCards = uploadedCards.filter(card => card.id !== id);
    localStorage.setItem('customPortfolioCards', JSON.stringify(updatedCards));
    setUploadedCards(updatedCards);
    
    // Dispatch event with delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customCardAdded', { 
        detail: { action: 'delete', cardId: id }
      }));
    }, 100);
    
    toast.success('Portfolio card deleted successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Card Upload & Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage portfolio cards that will appear on the public Portfolio page.
        </p>
      </motion.div>

      {/* Tab Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={() => setShowManagement(false)}
          className={`${!showManagement ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          <Upload size={16} className="mr-2" />
          Upload New Card
        </Button>
        <Button
          onClick={() => setShowManagement(true)}
          variant={showManagement ? 'default' : 'outline'}
        >
          <FileText size={16} className="mr-2" />
          Manage Cards ({uploadedCards.length})
        </Button>
      </div>

      {showManagement ? (
        // Management View
        <div className="space-y-6">
          {uploadedCards.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No uploaded cards yet. Create your first card!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <ImageWithFallback
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(card)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit2 size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(card.id)}
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2">{card.category}</Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{card.description}</p>
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        {card.client && <span>{card.client}</span>}
                        {card.date && <span>{card.date}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Upload Form View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2" size={20} />
                {editingId ? 'Edit Portfolio Card' : 'Upload New Portfolio Card'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <Label>Cover Image *</Label>
                <div className="mt-2">
                  {formData.coverImage ? (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleImageUpload('cover')}
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleImageUpload('cover')}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-gray-500 dark:text-gray-400">Click to upload cover image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <Label htmlFor="details">Detailed Description</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  placeholder="Detailed project description for the case study..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Photography, Wedding, Traditional"
                />
              </div>

              {/* Additional Images */}
              <div>
                <Label>Additional Images</Label>
                <div className="mt-2 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.additionalImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={image}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleImageUpload('additional')}
                    >
                      <Plus className="text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="mr-2" size={16} />
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2" size={16} />
                  {editingId ? 'Update Card' : 'Publish Card'}
                </Button>
                {editingId && (
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: '',
                        category: '',
                        description: '',
                        client: '',
                        date: '',
                        location: '',
                        details: '',
                        tags: '',
                        coverImage: '',
                        additionalImages: []
                      });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2" size={20} />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.coverImage && formData.title ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-900">
                      <ImageWithFallback
                        src={formData.coverImage}
                        alt={formData.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {formData.category && (
                          <Badge 
                            variant="secondary" 
                            className="mb-3 bg-blue-600/80 text-white border-0"
                          >
                            {formData.category}
                          </Badge>
                        )}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {formData.title}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {formData.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill in the form to see preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Details (when in preview mode) */}
            {previewMode && formData.title && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Study Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.client && (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <User size={16} className="text-blue-400" />
                        <span className="text-sm">{formData.client}</span>
                      </div>
                    )}
                    {formData.date && (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Calendar size={16} className="text-blue-400" />
                        <span className="text-sm">{new Date(formData.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <MapPin size={16} className="text-blue-400" />
                        <span className="text-sm">{formData.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  {formData.details && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Project Details</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {formData.details}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {formData.tags && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  {formData.additionalImages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Gallery</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.additionalImages.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative h-20 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
