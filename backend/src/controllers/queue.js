const VulReport = require('../model/schema')

let limit;

const initLimit = async () => {
    if (!limit) {
        const { default: pLimit } = await import('p-limit');
        limit = pLimit(2);
    }
    return limit;
};

const addToQueue = async (dbId, scanTask) => {
    const limiter = await initLimit();
    // This returns immediately to the controller
    limiter(async () => {
        try {
            console.log("started scanning, ", dbId);
            await VulReport.findByIdAndUpdate(dbId, { scan_status: 'running', started_at: new Date() });
            
            // Execute the specific scan logic (Sast, Dast, etc.)
            await scanTask();
            console.log("completed scanning, ", dbId);
        } catch (error) {
            console.error(`Scan ${dbId} failed:`, error);
            await VulReport.findByIdAndUpdate(dbId, { 
                scan_status: 'failed', 
                report: { error: error.message },
                finished_at: new Date() 
            });
        }
    });
};

module.exports = { addToQueue };