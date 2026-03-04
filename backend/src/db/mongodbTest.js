import dotenv from 'dotenv';
import mongoose from 'mongoose';
import VulReport from '../model/schema.js';

dotenv.config();
import connectDB from './mongodbService.js';


const testConnection = async () => {
    try {
        await connectDB();                
        console.log('MongoDB connection established');
        const testReport = new VulReport({
            _id: new mongoose.Types.ObjectId(),
            client_id: 'test_client',
            scan_id: 'test_scan',   
            scan_type: 'SAST', 
            scan_status: 'pending',
            report: { test: 'This is a test report' },
        });
        try{
            const saved = await VulReport.create(testReport);
            console.log('Test report saved successfully');
        }
        catch(err){
            console.error('Error saving test report:', err);
        }
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB Atlas');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection test failed:', error);
        process.exit(1);
    }
};

testConnection();   