import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Save, 
  Calculator, 
  Download, 
  Eye, 
  Calendar,
  User,
  Building,
  DollarSign,
  FileText,
  CheckSquare,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { eventNames } from 'process';
import { API_ENDPOINTS } from '../config/apiConfig';

interface NewEntryFormData {
  clientName: string;
  eventName: string;
  clientContact: string;
  clientEmail : string;
  eventStartDate: string;
  eventEndDate: string;
  invoiceDate: string;
  eventType: string;
  amount: string;
  discount: string;
  referral: string;
  empPointOfContact: string;
  deliverables: string[];
  additionalNotes: string;
  eventCode: string;
}

interface ProcessedData {
  id: string;
  formData: NewEntryFormData;
  generatedInvoiceNumber: string;
  totalAmount: string;
  taxAmount: string;
  finalAmount: string;
  termsAndConditions: string;
  projectTimeline: string;
  estimatedCompletion: string;
  status: 'processed';
}

export function NewEntryPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewEntryFormData>({
    clientName: '',
    eventName: '',
    clientContact : '',
    clientEmail : '', 
    eventStartDate: '',
    eventEndDate: '',
    invoiceDate: '',
    eventType: '',
    amount: '',
    discount: '',
    referral: '',
    empPointOfContact: '',
    deliverables: [],
    additionalNotes: '',
    eventCode: ''
  });

  // Cleanup blob URL on unmount
  React.useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const eventTypes = [
    'Wedding Photography',
    'Corporate Event',
    'Music Concert',
    'Conference',
    'Product Launch',
    'Fashion Show',
    'Birthday Party',
    'Anniversary',
    'Custom Merchandise',
    'Social Media Campaign',
    'Brand Identity',
    'Website Design',
    'Video Production',
    'Documentary',
    'Commercial',
    'Other'
  ];

  const deliverableOptions = [
    'Photography (Basic)',
'Photography (Standard)',
'Photography (Premium)',
'Videography (Cinematic Highlights)',
'Videography (Full Coverage)',
'Drone Coverage (Standard)',
'Drone Coverage (Premium)',
'Live Streaming',
'Photo Editing',
'Video Editing (Cinematic Highlight)',
'Video Editing (Traditional)',
'Album Basic',
'Album Standard',
'Album Premium',
'Digital Gallery',
'Prints (5x7)',
'Prints (8x10)',
'Canvas Prints',
'Social Media Content',
'Highlight Reel',
'Documentary Film',
'Custom Merchandise',
'Branding Materials',
'Logo Design',
'Website Development',
'Digital Marketing',
'Consultation'
  ];

  const employees = [
    'Mriganka Jana - Founder & Creatives Head',
    'Ayan Maity - Finance Manager',
    'Debmalya Mondal - Operations Head',
    'Srijita Maity - PR & Marketing Head',
    'Sonia Bag - Lead Creative Content Producer',
    'Ayush Sikdar - LinkedIn Marketing Specialist',
    'Rupam Das - Graphics Designer',
    'Madhu Maloti Soren - Graphics Designer',
    'Souhardya Bandyopadhyay - SFX Artist',
    'Tushar Barfe - SFX Artist',
    'Debaprasad Kandar - Videographer',
  ];

  const handleInputChange = (field: keyof NewEntryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliverableToggle = (deliverable: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter(d => d !== deliverable)
        : [...prev.deliverables, deliverable]
    }));
  };

  const calculateAmount = async () => {
  // Use the same validation as processEntry
  // if (!validateForm()) return;

  try {
    const res = await fetch(API_ENDPOINTS.calculate.amount, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliverables: formData.deliverables,
        eventName: formData.eventName,
        clientName: formData.clientName,
        clientContact : formData.clientContact,
        clientEmail : formData.clientEmail,
        eventType : formData.eventType,
        discount: formData.discount,
        startTime: formData.eventStartDate,
        endTime: formData.eventEndDate,
        additionalNotes: formData.additionalNotes
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      toast.error(error.detail || "Calculation failed");
      return;
    }
    const data = await res.json();
    setFormData(prev => ({
      ...prev,
      amount: data.amount.toString(),
      eventCode: data.event_code.toString()
    }));
    toast.success(`Calculated amount: ₹${data.amount}`);
  } catch (err) {
    toast.error("Calculation failed");
  }
};

  const validateForm = () => {
    const required = ['clientName', 'eventName', 'eventStartDate', 'eventEndDate', 'invoiceDate', 'eventType', 'amount', 'empPointOfContact','clientName','clientContact'];
    const missing = required.filter(field => !formData[field as keyof NewEntryFormData]);
    
    if (missing.length > 0) {
      toast.error(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    if (formData.deliverables.length === 0) {
      toast.error('Please select at least one deliverable');
      return false;
    }

    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    setIsConfirmed(true);
    toast.loading("Generating preview PDF...", { id: "pdf-preview" });

    try {
      // Create payload with all form data
      const payload = {
        clientName: formData.clientName,
        eventName: formData.eventName,
        clientContact: formData.clientContact,
        clientEmail: formData.clientEmail,
        eventStartDate: formData.eventStartDate,
        eventEndDate: formData.eventEndDate,
        invoiceDate: formData.invoiceDate,
        eventType: formData.eventType,
        amount: formData.amount,
        discount: formData.discount,
        referral: formData.referral,
        empPointOfContact: formData.empPointOfContact,
        deliverables: formData.deliverables,
        additionalNotes: formData.additionalNotes,
        eventCode: formData.eventCode
      };

      // Call the backend to generate PDF
      const response = await fetch(`${API_ENDPOINTS.offer.generateEntryPdf}?preview=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to generate preview');
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const blobUrl = URL.createObjectURL(blob);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(blobUrl);
      setShowPreview(true);
      toast.success("Preview ready!", { id: "pdf-preview" });
    } catch (error) {
      console.error('Preview error:', error);
      toast.error(error instanceof Error ? error.message : 'Error generating preview', { id: "pdf-preview" });
    } finally {
      setIsConfirmed(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfPreviewUrl) return;
    
    const a = document.createElement('a');
    a.href = pdfPreviewUrl;
    a.download = `ProjectDetails_${formData.clientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const closePreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    setShowPreview(false);
  };

  const processEntry = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setCurrentStep(2);

    try {
      // Call backend API to process entry
      const response = await fetch(`${API_ENDPOINTS.offer.processEntry}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.detail || 'Failed to process entry');
      }

      const processed = await response.json();
      setProcessedData(processed);
      setCurrentStep(3);
      toast.success('Entry processed successfully!');
    } catch (error) {
      console.error('Error processing entry:', error);
      toast.error(error instanceof Error ? error.message : 'Error processing entry. Please try again.');
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTimeline = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return `
Event Duration: ${duration} day(s)
Pre-production: 7-14 days before event
Event Coverage: ${startDate} to ${endDate}
Post-production: 30-45 business days after event
    `.trim();
  };

  const calculateCompletionDate = (eventEndDate: string) => {
    const end = new Date(eventEndDate);
    end.setDate(end.getDate() + 30);
    return end.toISOString().split('T')[0];
  };

  const confirmAndGeneratePDF = async () => {
    if (!processedData) return;
    
    setIsConfirmed(true);
    toast.loading('Generating PDF...', { id: 'pdf-gen' });
    
    try {
      // Call the backend PDF endpoint with the processed data
      const response = await fetch(`${API_ENDPOINTS.offer.generateEntryPdf}?preview=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData.formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = `${processedData.generatedInvoiceNumber}_ProjectDetails.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success('PDF generated and downloaded successfully!', { id: 'pdf-gen' });
      
      // Reset form for new entry
      setTimeout(() => {
        setCurrentStep(1);
        setProcessedData(null);
        setIsConfirmed(false);
        setFormData({
          clientName: '',
          eventName: '',
          clientContact : '',
          clientEmail : '',
          eventStartDate: '',
          eventEndDate: '',
          invoiceDate: '',
          eventType: '',
          discount: '',
          amount: '',
          referral: '',
          empPointOfContact: '',
          deliverables: [],
          additionalNotes: '',
          eventCode: ''
        });
        toast.success('Ready for new entry!');
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.', { id: 'pdf-gen' });
      setIsConfirmed(false);
    }
  };

  const generatePDFContent = () => {
    if (!processedData) return '';
    
    return `
MAK STARK CREATIVE AGENCY
PROJECT DETAILS & INVOICE

Event Code: ${formData.eventCode}
Invoice Number: ${processedData.generatedInvoiceNumber}
Date: ${processedData.formData.invoiceDate}

CLIENT INFORMATION:
Name: ${processedData.formData.clientName}
Contact: ${processedData.formData.clientContact}
Email: ${processedData.formData.clientEmail}
Event: ${processedData.formData.eventName}

EVENT DETAILS:
Start Date: ${processedData.formData.eventStartDate}
End Date: ${processedData.formData.eventEndDate}
Type: ${processedData.formData.eventType}

FINANCIAL DETAILS:
Base Amount: ₹${formData.amount}
Discount: ₹${processedData.formData.discount}%
Total Amount: ₹${processedData.totalAmount}

DELIVERABLES:
${processedData.formData.deliverables.map(d => `• ${d}`).join('\n')}

PROJECT TIMELINE:
${processedData.projectTimeline}

Additional Notes:
${processedData.formData.additionalNotes || 'None'}

ESTIMATED COMPLETION: ${processedData.estimatedCompletion}

POINT OF CONTACT:
${processedData.formData.empPointOfContact}

REFERRAL: ${processedData.formData.referral || 'Direct Client'}

TERMS & CONDITIONS:
${processedData.termsAndConditions}

ADDITIONAL NOTES:
${processedData.formData.additionalNotes || 'None'}

---
Generated by Mak Stark Dashboard System
    `;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step === 2 && isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (currentStep === 2) {
    return (
      <div className="max-w-4xl mx-auto">
        {renderStepIndicator()}
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 size={48} className="animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-semibold mb-2">Processing Entry</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your entry is being processed through our Python backend system...
            </p>
            <div className="max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckSquare size={16} className="mr-2 text-green-600" />
                Validating entry data
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckSquare size={16} className="mr-2 text-green-600" />
                Calculating amounts and taxes
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Loader2 size={16} className="mr-2 animate-spin text-blue-600" />
                Generating terms and conditions
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <AlertCircle size={16} className="mr-2 text-gray-400" />
                Storing in database
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 3 && processedData) {
    return (
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Processed Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" size={20} />
                Generated Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Invoice Number</Label>
                  <p className="font-semibold">{processedData.generatedInvoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <Badge className="bg-green-100 text-green-800">Processed</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm text-gray-500">Financial Breakdown</Label>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{processedData.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>₹{processedData.taxAmount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{processedData.finalAmount}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm text-gray-500">Estimated Completion</Label>
                <p>{processedData.estimatedCompletion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Original Form Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2" size={20} />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Client Name</Label>
                  <p className="font-semibold">{processedData.formData.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Event Name</Label>
                  <p className="font-semibold">{processedData.formData.eventName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Event Type</Label>
                  <p>{processedData.formData.eventType}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Point of Contact</Label>
                  <p>{processedData.formData.empPointOfContact}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-gray-500">Deliverables</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {processedData.formData.deliverables.map((deliverable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms and Conditions Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {processedData.termsAndConditions}
            </pre>
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {processedData.projectTimeline}
            </pre>
          </CardContent>
        </Card>

        {/* Confirm and Generate PDF */}
        <Card>
          <CardContent className="p-6">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please review all the information above. Once confirmed, a PDF will be generated and downloaded.
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-4">
              <Button 
                onClick={confirmAndGeneratePDF}
                disabled={isConfirmed}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConfirmed ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Confirm & Generate PDF
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
                disabled={isConfirmed}
              >
                Back to Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {renderStepIndicator()}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2" size={24} />
              New Project Entry
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the project details below. All fields marked with * are required.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Client Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Client Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Enter client's full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    placeholder="Enter event or project name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientContact">Client Contact *</Label>
                  <Input
                    id="clientContact"
                    value={formData.clientContact}
                    onChange={(e) => handleInputChange('clientContact', e.target.value)}
                    placeholder="Enter client's contact number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientEmail">Client Email *</Label>
                  <Input
                    id="clientEmail"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="Enter Client's email address"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="referral">Referral Source</Label>
                <Input
                  id="referral"
                  value={formData.referral}
                  onChange={(e) => handleInputChange('referral', e.target.value)}
                  placeholder="How did they find us? (optional)"
                />
              </div>
            </div>

            <Separator />

            {/* Event Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Event Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="eventStartDate">Event Start Date *</Label>
                  <Input
                    id="eventStartDate"
                    type="date"
                    value={formData.eventStartDate}
                    onChange={(e) => handleInputChange('eventStartDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventEndDate">Event End Date *</Label>
                  <Input
                    id="eventEndDate"
                    type="date"
                    value={formData.eventEndDate}
                    onChange={(e) => handleInputChange('eventEndDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Select 
                  value={formData.eventType} 
                  onValueChange={(value : string) => handleInputChange('eventType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Team Assignment */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Building size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Team Assignment</h3>
              </div>
              
              <div>
                <Label htmlFor="empPointOfContact">Employee Point of Contact *</Label>
                <Select 
                  value={formData.empPointOfContact} 
                  onValueChange={(value : string) => handleInputChange('empPointOfContact', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee} value={employee}>
                        {employee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Deliverables */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <CheckSquare size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Deliverables *</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliverableOptions.map((deliverable) => (
                  <div key={deliverable} className="flex items-center space-x-2">
                    <Checkbox
                      id={deliverable}
                      checked={formData.deliverables.includes(deliverable)}
                      onCheckedChange={() => handleDeliverableToggle(deliverable)}
                    />
                    <Label htmlFor={deliverable} className="text-sm">
                      {deliverable}
                    </Label>
                  </div>
                ))}
              </div>
              
              {formData.deliverables.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-gray-500">Selected Deliverables:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="secondary">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Financial Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <DollarSign size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Financial Details</h3>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="amount">Project Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="project amount WILL BE CALCULATED"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="DISCOUNT">Discount (%) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    placeholder="Enter discount percentage"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={calculateAmount}
                    className="h-10"
                  >
                    <Calculator size={16} className="mr-2" />
                    Calculate
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Notes */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Additional Notes</h3>
              </div>
              
              <div>
                <Label htmlFor="additionalNotes">Project Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information about the project..."
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={handlePreview}
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
                
                <Button 
                  onClick={processEntry}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save size={16} className="mr-2" />
                  Process Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      {showPreview && pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle>Project Quotation Preview</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(pdfPreviewUrl, "_blank")}
                >
                  <Eye size={16} className="mr-2" />
                  Open in Tab
                </Button>
                <Button 
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={closePreview}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <iframe 
                title="Project Preview" 
                src={pdfPreviewUrl} 
                className="w-full h-full border-0"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}