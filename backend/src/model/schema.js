import mongoose from 'mongoose';

const vulReports = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    client_name: String, 
    scan_id: String,
    scan_type: { type: String, enum: ['SAST', 'DAST', 'Container', 'MobileAPK', 'Network'] },
    scan_remediated_status: { type: String, enum: ['in_progress', 'completed', 'failed'] },
    scan_status: {type: String, enum: ['completed', 'failed', 'pending', 'running'], default: 'failed' },
    started_at: { type: Date, default: Date.now },
    finished_at: { type: Date },
    report: Object,
})

const VulReport = mongoose.model('VulReport', vulReports);

export default VulReport;