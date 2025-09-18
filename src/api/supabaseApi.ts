import axios from "axios";

// Login and store JWT
export async function login(email: string, password: string) {
  const res = await axios.post("http://localhost:8000/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
}

// Call protected offer letter endpoint
export async function generateOffer(data: { name: string; position: string; salary: number }) {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:8000/offer/generate-offer",
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// Call protected PDF endpoint and download PDF
export async function getPDF() {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:8000/pdf/generate-pdf",
    { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
  );
  // Download PDF
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "generated.pdf");
  document.body.appendChild(link);
  link.click();
}