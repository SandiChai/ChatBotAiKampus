import "dotenv/config";
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMNI_MODEL = "gemini-3.5-flash-lite";

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server lokal berjalan di: http://localhost:${PORT}`);
  console.log(`Server publik (Ngrok) : https://bulge-wildfowl-barometer.ngrok-free.dev`);
});

app.post('/generate-text', async (req, res)=>{
    const {prompt} = req.body;

    try{
        const response = await ai.models.generateContent({
            model: GEMNI_MODEL,
            contents: prompt
        });

        // wajib ada paramater 'prompt' ketika hit API

        res.status(200).json({ result: response.text});
    }catch(e){
        console.log(e);
        res.status(500).json({ message: e.message});
        
    };
})

app.post("/generate-from-image", upload.single("fileUpload"), async (req, res) =>{
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");

    try{
        const response = await ai.models.generateContent({
            model: GEMNI_MODEL,
            contents: [
                {text : prompt?? "Tolong buat ringkasan dari dokumen berikut.", type: "text"},
                {inlineData: {data: base64Document, mimeType: req.file.mimetype}}
            ],
        });

         // wajib ada paramater 'fileUpload' sedangkan 'prompt' tidak perlu ketika hit API
         // mimeType: req.file.mimetype untuk handling terima semua format file, kalau mau validasi format file disini

        res.status(200).json({ result: response.text});
    }catch(e){
        console.log(e);
        res.status(500).json({ message: e.message});
    }
})

