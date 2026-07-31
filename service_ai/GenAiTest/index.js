import "dotenv/config";
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMNI_MODEL = "gemini-3.5-flash-lite";

app.use(cors({
  origin: '*', // Mengizinkan request dari mana saja (localhost, Netlify, dll)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'ngrok-skip-browser-warning'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server lokal berjalan di: http://localhost:${PORT}`);
  console.log(`Server publik (Ngrok) : https://bulge-wildfowl-barometer.ngrok-free.dev`);
});

app.post('/generate-text', async (req, res)=>{

    try{
        const prompt = req.body.prompt || "Jelaskan mengenai hal ini";
        const tempIndex = req.body.tempIndex;

        console.log("DATA TEMP Index : " + tempIndex);

        if (!req.body.tempIndex) {
            return res.status(400).json({ 
                error: "Body Temp Index tidak ditemukan dalam request" 
            });
        }
        
        const response = await ai.models.generateContent({
            model: GEMNI_MODEL,
            contents: prompt,
            config:{
                temperature: tempIndex,
                systemInstruction: "Jawab hanya menggunakan bahasa Indonesia."
            },
        });

        res.status(200).json({ result: response.text});
    }catch(e){
        console.log(e);
        res.status(500).json({ message: e.message});
        
    };
})

app.post("/generate-from-image", upload.single("fileUpload"), async (req, res) =>{
   
    try{
        console.log("--> Request Masuk ke /generate-from-image");
    
        const prompt = req.body.prompt || "Jelaskan file atau gambar ini";
        const tempIndex = req.body.tempIndex;
        console.log("Prompt:", prompt);

        console.log("DATA TEMP Index : " + tempIndex);

        if (!req.body.tempIndex) {
            return res.status(400).json({ 
                error: "Body Temp Index tidak ditemukan dalam request" 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                error: "File tidak ditemukan dalam request. Pastikan field bernama 'fileUpload'." 
            });
        }

        const base64Document = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;
    
        const response = await ai.models.generateContent({
            model: GEMNI_MODEL,
            contents: [
                {text : prompt?? "Tolong buat ringkasan dari dokumen berikut.", type: "text"},
                {inlineData: {data: base64Document, mimeType: req.file.mimetype}}
            ],
            config:{
                temperature: tempIndex,
                systemInstruction: "Jawab hanya menggunakan bahasa Indonesia."
            },
        });

         // wajib ada paramater 'fileUpload' sedangkan 'prompt' tidak perlu ketika hit API
         // mimeType: req.file.mimetype untuk handling terima semua format file, kalau mau validasi format file disini

        res.status(200).json({ result: response.text});
    }catch(e){
        console.log(e);
        res.status(500).json({ message: e.message});
    }
})

