require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./mongodbService.js');
const VulReport = require('../model/schema.js');

const testConnection = async () => {
    try {
        await connectDB();                
        console.log('MongoDB connection established');
        const testReport = new VulReport({
            _id: new mongoose.Types.ObjectId(),
            client_id: 'test_client',
            scan_id: 'test_scan',   
            scan_type: 'DAST', 
            scan_status: 'in_progress',
            report: { test: 'This is a test report' },
        });
        try{
            const saved = await VulReport.create(testReport);
            console.log('Test report saved successfully');
        }
        catch(err){
            console.error('Error saving test report:', err);
        }
        

        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection test failed:', error);
        process.exit(1);
    }
};

testConnection();   