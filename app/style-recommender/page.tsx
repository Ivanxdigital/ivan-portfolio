'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HexColorPicker } from 'react-colorful';
import { motion } from 'framer-motion';
import { Clipboard, Download, Sparkles, Upload, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StyleRecommender() {
  // Result states
  const [result, setResult] = useState('');
  const [formattedResult, setFormattedResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [color, setColor] = useState('#6366f1'); // Default primary color
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generateMockup, setGenerateMockup] = useState(false);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [generatingMockup, setGeneratingMockup] = useState(false);
  const [mockupError, setMockupError] = useState<string | null>(null);

  // Animation states
  const [formVisible, setFormVisible] = useState(true);

  // Hidden input refs
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Vibe presets
  const vibeOptions = [
    { value: '', label: 'Select a vibe...' },
    { value: 'modern-minimalist', label: 'Modern & Minimalist' },
    { value: 'bold-vibrant', label: 'Bold & Vibrant' },
    { value: 'elegant-luxury', label: 'Elegant & Luxury' },
    { value: 'playful-creative', label: 'Playful & Creative' },
    { value: 'corporate-professional', label: 'Corporate & Professional' },
    { value: 'eco-natural', label: 'Eco-friendly & Natural' },
    { value: 'tech-futuristic', label: 'Tech & Futuristic' },
    { value: 'vintage-retro', label: 'Vintage & Retro' },
  ];

  // Update formatted result whenever result changes
  useEffect(() => {
    if (result) {
      setFormattedResult(result);
    }
  }, [result]);

  // Update hidden color input when color changes
  useEffect(() => {
    if (colorInputRef.current) {
      colorInputRef.current.value = color;
    }
  }, [color]);

  // Cleanup image preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle image selection for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      // Create a preview URL for the first selected image
      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Handle vibe selection
  const handleVibeChange = (value: string) => {
    setSelectedVibe(value);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    if (formattedResult) {
      try {
        await navigator.clipboard.writeText(formattedResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // Custom components for ReactMarkdown
  const components = {
    p: ({ children }: any) => <p className="my-2">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-6 mb-3 gradient-text">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold mt-5 mb-2 text-primary">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
    ul: ({ children }: any) => <ul className="list-disc pl-6 my-3">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 my-3">{children}</ol>,
    li: ({ children }: any) => <li className="my-1">{children}</li>,
    // Add custom color badge renderer
    text: ({ children }: any) => {
      if (typeof children !== 'string') return <>{children}</>;

      // Match hex color codes
      const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;

      // If no hex codes, return as is
      if (!hexColorRegex.test(children)) return <>{children}</>;

      // Split by hex codes and render with color badges
      const parts = children.split(hexColorRegex);
      const matches = children.match(hexColorRegex) || [];

      return (
        <>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {matches[i] && (
                <>
                  <span className="font-mono">{matches[i]}</span>
                  <span
                    className="inline-block w-3 h-3 rounded-full ml-1 border border-gray-400"
                    style={{ backgroundColor: matches[i] }}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setMockupImage(null);
    setCopied(false);

    // Animate form transition when generating results
    if (result) {
      setFormVisible(false);
      // Small delay to allow animation to complete
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const data = new FormData(e.currentTarget);
    const businessInfo = data.get('businessInfo')?.toString() || '';
    const colors = data.get('colors')?.toString() || '';
    const vibe = data.get('vibe')?.toString() || '';

    try {
      // Make a streaming request to the API
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Get the response as a readable stream
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('No reader available');
      }

      // Read the stream chunk by chunk
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResult = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          // Decode the chunk and add it to the result
          const chunkText = decoder.decode(value, { stream: !done });
          accumulatedResult += chunkText;
          setResult(accumulatedResult);
        }
      }

      // Generate mockup image if checkbox is checked
      if (generateMockup && accumulatedResult) {
        try {
          setGeneratingMockup(true);
          setMockupError(null);

          console.log('Sending request to generate image...');
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              businessInfo,
              colors,
              vibe,
              brief: accumulatedResult
            }),
          });

          console.log('Image response status:', imageResponse.status);
          const imageData = await imageResponse.json();
          console.log('Image response data:', imageData);

          if (imageResponse.ok && imageData.imageUrl) {
            console.log('Setting mockup image URL:', imageData.imageUrl);

            // Check if the URL is valid before setting it
            const isValidUrl = (url: string) => {
              try {
                new URL(url);
                return true;
              } catch (e) {
                return false;
              }
            };

            if (isValidUrl(imageData.imageUrl)) {
              setMockupImage(imageData.imageUrl);

              // Verify the image can be loaded
              const img = new Image();
              img.onload = () => console.log('Image loaded successfully');
              img.onerror = () => {
                console.error('Image URL exists but cannot be loaded:', imageData.imageUrl);
                setMockupError('Image URL exists but cannot be loaded. Please try again.');
                setMockupImage(null);
              };
              img.src = imageData.imageUrl;
            } else {
              console.error('Invalid image URL received:', imageData.imageUrl);
              setMockupError('Invalid image URL received. Please try again.');
            }
          } else {
            // Handle error response
            const errorMessage = imageData.details || imageData.error || 'Failed to generate mockup image';
            console.error('Image generation error:', errorMessage);
            setMockupError(errorMessage);
          }
        } catch (imageError: any) {
          console.error('Error generating mockup:', imageError);
          setMockupError(imageError.message || 'An unexpected error occurred');
        } finally {
          setGeneratingMockup(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to generate brief. Please try again.');
    } finally {
      setLoading(false);
      // Show the form again with animation
      setFormVisible(true);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-3 gradient-text">Website Style Recommender</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized website style recommendations based on your business needs and preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 1 }}
          animate={{
            opacity: formVisible ? 1 : 0.5,
            scale: formVisible ? 1 : 0.98,
            x: result && !formVisible ? -20 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-primary/20 shadow-xl bg-secondary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Create Your Style Brief
              </CardTitle>
              <CardDescription>
                Tell us about your business and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                {/* Business Info */}
                <div className="space-y-2">
                  <Label htmlFor="businessInfo" className="text-sm font-medium">
                    Tell me about your business
                  </Label>
                  <Textarea
                    id="businessInfo"
                    name="businessInfo"
                    placeholder="Describe your business, target audience, and what you want to achieve with your website..."
                    required
                    className="min-h-[120px] bg-secondary/20 border-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-sm font-medium">
                    Preferred color
                  </Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-md cursor-pointer border border-primary/30 shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    <Input
                      ref={colorInputRef}
                      id="colors"
                      name="colors"
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-secondary/20 border-primary/20"
                    />
                  </div>

                  {/* Color Picker Popover */}
                  {showColorPicker && (
                    <motion.div
                      className="relative mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="absolute z-20 p-3 bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl border border-primary/20">
                        <HexColorPicker color={color} onChange={setColor} />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full mt-3 border-primary/20 hover:bg-primary/20"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Apply Color
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Vibe Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="vibe" className="text-sm font-medium">
                    Desired vibe
                  </Label>
                  <Select name="vibe" value={selectedVibe} onValueChange={handleVibeChange}>
                    <SelectTrigger className="w-full bg-secondary/20 border-primary/20">
                      <SelectValue placeholder="Select a vibe..." />
                    </SelectTrigger>
                    <SelectContent>
                      {vibeOptions.map((option) => (
                        option.value ? (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ) : null
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload with Preview */}
                <div className="space-y-2">
                  <Label htmlFor="images" className="text-sm font-medium">
                    Upload inspiration image (max 4 MB)
                  </Label>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 transition-colors hover:border-primary/40">
                    <div className="flex flex-col items-center justify-center gap-2 relative">
                      {!imagePreview ? (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                          {/* File input only covers the upload area */}
                          <input
                            id="images"
                            type="file"
                            name="images"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="opacity-0 absolute inset-0 cursor-pointer h-full w-full"
                          />
                        </>
                      ) : (
                        <div className="relative w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-md shadow-md border border-primary/20"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => setImagePreview(null)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Generate Mockup Checkbox */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="generateMockup"
                    checked={generateMockup}
                    onCheckedChange={(checked) => setGenerateMockup(checked === true)}
                  />
                  <Label htmlFor="generateMockup" className="text-sm font-medium cursor-pointer">
                    Also generate a visual website mock-up
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-bg hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Brief</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Creative Brief */}
              <Card className="border border-primary/20 shadow-xl bg-secondary/10 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-primary/10 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Website Style Brief
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-primary/20 hover:bg-primary/20"
                        onClick={handleCopyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-primary/20 hover:bg-primary/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 max-h-[600px] overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={components}
                    >
                      {formattedResult}
                    </ReactMarkdown>
                  </div>
                  {loading && <span className="animate-pulse">▌</span>}
                </CardContent>
              </Card>

              {/* Mockup Image */}
              {generateMockup && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border border-primary/20 shadow-xl bg-secondary/10 backdrop-blur-sm">
                    <CardHeader className="border-b border-primary/10 bg-secondary/20">
                      <CardTitle className="text-lg">Website Mockup</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {generatingMockup && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-muted-foreground">Generating mockup image...</p>
                        </div>
                      )}

                      {mockupImage && !generatingMockup && (
                        <div className="flex flex-col items-center">
                          <img
                            src={mockupImage}
                            alt="Website Mockup"
                            className="max-w-full rounded-md shadow-lg border border-primary/20"
                          />
                          <p className="mt-4 text-sm text-muted-foreground">
                            Generated mockup based on your brief
                          </p>
                        </div>
                      )}

                      {!mockupImage && !generatingMockup && result && (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-yellow-400 text-center">
                            <p className="font-medium mb-2">Failed to generate mockup image</p>
                            {mockupError && (
                              <p className="text-sm opacity-80">{mockupError}</p>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4 border-primary/20 hover:bg-primary/20"
                              onClick={() => {
                                if (result) {
                                  // Get form data from the form elements
                                  const businessInfoElement = document.querySelector('[name="businessInfo"]') as HTMLTextAreaElement;
                                  const colorsElement = document.querySelector('[name="colors"]') as HTMLInputElement;
                                  const vibeSelect = document.querySelector('[name="vibe"]') as HTMLSelectElement;

                                  const businessInfo = businessInfoElement?.value || '';
                                  const colors = colorsElement?.value || '';
                                  const vibe = vibeSelect?.value || '';

                                  setGeneratingMockup(true);
                                  setMockupError(null);
                                  console.log('Retrying image generation...', { businessInfo, colors, vibe });
                                  fetch('/api/generate-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      businessInfo,
                                      colors,
                                      vibe,
                                      brief: result
                                    }),
                                  })
                                  .then(res => {
                                    console.log('Retry response status:', res.status);
                                    return res.json().then(data => ({ status: res.status, data }));
                                  })
                                  .then(({ status, data }) => {
                                    console.log('Retry response data:', data);
                                    if (status === 200 && data.imageUrl) {
                                      console.log('Setting mockup image URL from retry:', data.imageUrl);

                                      // Check if the URL is valid before setting it
                                      const isValidUrl = (url: string) => {
                                        try {
                                          new URL(url);
                                          return true;
                                        } catch (e) {
                                          return false;
                                        }
                                      };

                                      if (isValidUrl(data.imageUrl)) {
                                        setMockupImage(data.imageUrl);

                                        // Verify the image can be loaded
                                        const img = new Image();
                                        img.onload = () => console.log('Retry: Image loaded successfully');
                                        img.onerror = () => {
                                          console.error('Retry: Image URL exists but cannot be loaded:', data.imageUrl);
                                          setMockupError('Image URL exists but cannot be loaded. Please try again.');
                                          setMockupImage(null);
                                        };
                                        img.src = data.imageUrl;
                                      } else {
                                        console.error('Retry: Invalid image URL received:', data.imageUrl);
                                        setMockupError('Invalid image URL received. Please try again.');
                                      }
                                    } else {
                                      const errorMsg = data.details || data.error || 'Failed to generate image';
                                      console.error('Retry image generation error:', errorMsg);
                                      setMockupError(errorMsg);
                                    }
                                  })
                                  .catch(err => {
                                    setMockupError(err.message || 'An unexpected error occurred');
                                  })
                                  .finally(() => {
                                    setGeneratingMockup(false);
                                  });
                                }
                              }}
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
