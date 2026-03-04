import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // Tester who triggered it
  
  scan_type: { type: String, enum: ['SAST', 'DAST', 'Container', 'MobileAPK', 'Network'], required: true },
  scan_status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending', index: true },
  
  started_at: { type: Date },
  finished_at: { type: Date },
  
  // Store the raw JSON dump from the scanner tool for auditing purposes
  raw_report_data: { type: mongoose.Schema.Types.Mixed }, 
  
  error_message: { type: String } // If scan_status is 'failed'
}, { timestamps: true });

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;