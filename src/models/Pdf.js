<<<<<<< HEAD
// models/Pdf.js
import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Pdf", PdfSchema);
=======
// models/Pdf.js
import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Pdf", PdfSchema);
>>>>>>> c2e165e690364d3930de25f96960e6d9bb5ede11
