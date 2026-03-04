// //connection to loacalhost
import mongoose from 'mongoose';
const connectDB = async () => {
    try {   
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }           
};

export default connectDB;


//connection to atlas

// import mongoose from 'mongoose';
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// const connectDB = async () => {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(process.env.MONGO_URI, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// }

// export default connectDB;
