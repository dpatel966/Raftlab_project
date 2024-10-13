const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ msg: "File not found" });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = data[0].map(header => [String(header).trim()]);
        


        const formattedData = data.slice(1).map(row => {
            const sl = [String(row[0]).trim()]; 
            const particulars = [String(row[1]).trim()]; 
            const address = String(row[2]).trim().split(",").map(part => part.trim());
            const state = [String(row[3]).trim()]; 
        
            return [
                sl,
                particulars,
                address, 
                state
            ];
        });

     
       // const flatData = formattedData.flat();

       const partiesdata =  await party.create(
        {
            sl,
            particulars,
            address, 
            state
        }
          
       )

        res.json({ msg: "File uploaded", headers, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "An error occurred", error: err.message });
    }
});

module.exports = router;
