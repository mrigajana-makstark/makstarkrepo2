import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Save,
  Download,
  Eye,
  User,
  Building,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface NewCandidateFormData {
  candidateName: string;
  position: string;
  ctc: string;
  startDate: string;
  dept: string;
  additionalNotes: string;
}

interface ProcessedData {
  id: string;
  formData: NewCandidateFormData;
  generatedId: string;
  ctc: string;
  dept: string;
  joiningDate: string;
  termDate: string;
  status: "processed";
}

export default function OfferLetterGenerator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewCandidateFormData>({
    candidateName: "",
    position: "",
    ctc: "",
    startDate: "",
    dept: "",
    additionalNotes: "",
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  // ensure this always returns an object (fixes TS HeadersInit union error)
    function getAuthHeader(): Record<string, string> {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }

  // quick health-check on mount — logs connectivity to backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/`);
        console.log("Backend health check:", res.status, await res.text().catch(() => "[no body]"));
      } catch (e) {
        console.warn("Backend health check failed:", e);
      }
    })();
  }, [BACKEND_URL]);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const departments = [
    "Studio",
    "Production",
    "Customs",
    "Creative Agency",
    "Administration",
  ];

  const handleInputChange = (field: keyof NewCandidateFormData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required: (keyof NewCandidateFormData)[] = [
      "candidateName",
      "position",
      "ctc",
      "startDate",
      "dept",
    ];
    const missing = required.filter((k) => !formData[k] || formData[k].toString().trim() === "");
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  // 1) POST form to /generate-offer -> receive ProcessedData metadata
  const processEntry = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);
    setCurrentStep(2);

    const payload = {
      name: formData.candidateName,
      position: formData.position,
      salary: formData.ctc,
      start_date: formData.startDate,
      department: formData.dept,
      additionalNotes: formData.additionalNotes,
      formData,
    };
    console.log("POST -> /generate-offer", payload);

    try {
      const res = await fetch(`${BACKEND_URL}/generate-offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // getAuthHeader always returns an object
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "Failed to process entry");
      }

      const json = await res.json();
      // Attempt to map backend response to ProcessedData shape if possible.
      // If backend already returns ProcessedData, this will set directly.
      const mapped: ProcessedData = {
        id: json.id || json.generatedId || "generated-id",
        formData: json.formData || formData,
        generatedId: json.generatedId || json.id || "gen-" + Date.now(),
        ctc: json.calculated_salary ? String(json.calculated_salary) : formData.ctc,
        dept: json.department || formData.dept,
        joiningDate: json.joiningDate || formData.startDate,
        termDate: json.termDate || "",
        status: "processed",
      };
      setProcessedData(mapped);
      setCurrentStep(3);
      toast.success("Entry processed successfully!");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Error processing entry");
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2) Generate PDF (preview=true => inline)
  const confirmAndGeneratePDF = async (preview = false) => {
    if (!processedData && !validateForm()) return;

    const payload = processedData ? { ...processedData.formData, id: processedData.id } : {
      candidateName: formData.candidateName,
      position: formData.position,
      ctc: formData.ctc,
      startDate: formData.startDate,
      dept: formData.dept,
      additionalNotes: formData.additionalNotes,
    };
    console.log(`POST -> /generate-offer-pdf?preview=${preview}`, payload);

    setIsConfirmed(true);
    toast.loading(preview ? "Generating preview..." : "Generating PDF...", { id: "pdf-gen" });

    try {
      const url = `${BACKEND_URL}/generate-offer-pdf?preview=${preview ? "true" : "false"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "Failed to generate PDF");
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (preview) {
        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(blobUrl);
        toast.success("Preview ready", { id: "pdf-gen" });
        setIsConfirmed(false);
        return;
      }

      const a = document.createElement("a");
      const filename = `Offer_Letter_${(payload.candidateName || "offer").toString().replace(/\s+/g, "_")}.pdf`;
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success("PDF downloaded", { id: "pdf-gen" });

      // reset
      setTimeout(() => {
        setCurrentStep(1);
        setProcessedData(null);
        setIsConfirmed(false);
        setFormData({
          candidateName: "",
          position: "",
          ctc: "",
          startDate: "",
          dept: "",
          additionalNotes: "",
        });
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Error generating PDF", { id: "pdf-gen" });
      setIsConfirmed(false);
    }
  };

  const handlePreviewClick = async () => {
    if (!validateForm()) return;
    await processEntry();
    await confirmAndGeneratePDF(true);
  };

  const closePreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const PdfPreviewModal = () => {
    if (!pdfPreviewUrl) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-4xl h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="text-sm font-medium">Offer Letter Preview</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.open(pdfPreviewUrl, "_blank")}>Open in new tab</Button>
              <Button onClick={closePreview}>Close</Button>
            </div>
          </div>
          <iframe title="Offer Preview" src={pdfPreviewUrl} className="w-full h-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PdfPreviewModal />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2" size={20} />
              Offer Letter Generator
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Candidate Name</Label>
                <Input value={formData.candidateName} onChange={(e) => handleInputChange("candidateName", e.target.value)} placeholder="Enter candidate name" />
              </div>

              <div>
                <Label>Position</Label>
                <Input value={formData.position} onChange={(e) => handleInputChange("position", e.target.value)} placeholder="Enter position" />
              </div>

              <div>
                <Label>CTC (₹)</Label>
                <Input value={formData.ctc} onChange={(e) => handleInputChange("ctc", e.target.value)} placeholder="Enter CTC" />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <Label>Department</Label>
                <Select value={formData.dept} onValueChange={(v: string) => handleInputChange("dept", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Additional Notes</Label>
                <Textarea value={formData.additionalNotes} onChange={(e) => handleInputChange("additionalNotes", e.target.value)} rows={4} placeholder="Optional notes" />
              </div>
            </div>

            {/* Backend response panel */}
            {processedData && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Processed Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs max-h-48 overflow-auto">{JSON.stringify(processedData, null, 2)}</pre>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handlePreviewClick}>
                  <Eye size={14} className="mr-2" /> Preview
                </Button>

                <Button onClick={processEntry} className="bg-blue-600 hover:bg-blue-700">
                  <Save size={14} className="mr-2" /> Process Entry
                </Button>

                <Button onClick={() => confirmAndGeneratePDF(false)} className="bg-green-600 hover:bg-green-700" disabled={!processedData || isConfirmed}>
                  {isConfirmed ? <><Loader2 className="animate-spin mr-2" size={14} /> Generating...</> : <><Download size={14} className="mr-2" /> Generate & Download</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}