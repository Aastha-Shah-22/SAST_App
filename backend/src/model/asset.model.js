import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  asset_type: { 
    type: String, 
    enum: ['URL', 'MobileAPK', 'SourceCode', 'Network', 'Container'], 
    required: true 
  },
  
  // 1. Web Application URL
  url_details: {
    endpoint: { type: String }
  },

  // 2. Mobile APK (File Upload)
  apk_details: {
    storage_type: { type: String, enum: ['local', 'cloud'], required: true, default: 'local' },
    file_path: { type: String, required: true }, // e.g., "/uploads/apks/client-app-v1.apk" or "https://s3.aws.com/..."
    file_name: { type: String }, // e.g., "client-app-v1.apk"
    file_size_bytes: { type: Number } // Good for tracking storage limits
  },

  // 3. Network IP Address
  network_details: {
    ip_address: { type: String } // e.g., "192.168.1.50" or CIDR block "10.0.0.0/24"
  },

  // 4. Source Code (GitHub/GitLab)
  source_code_details: {
    repository_url: { type: String },
    access_token: { type: String }, // *Should be encrypted at rest*
    branch: { type: String, default: 'main' }
  },

  // 5. Container Image (Private Registry)
  container_details: {
    image_name: { type: String }, // e.g., "mycompany/myapp:latest"
    registry_url: { type: String }, // e.g., "ghcr.io" or "index.docker.io"
    username: { type: String },
    password: { type: String } // *Should be encrypted at rest*
  },

  description: { type: String },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

// Custom validation to ensure the right details are provided based on the asset_type
assetSchema.pre('save', function(next) {
  if (this.asset_type === 'MobileAPK' && !this.apk_details?.file_url) {
    return next(new Error('APK details (file_url) are required for MobileAPK assets.'));
  }
  else if (this.asset_type === 'Network' && !this.network_details?.ip_address) {
    return next(new Error('IP address is required for Network assets.'));
  }
  else if (this.asset_type === 'Container' && (!this.container_details?.image_name || !this.container_details?.registry_url)) {
    return next(new Error('Image name and Registry URL are required for Container assets.'));
  }
  else if (this.asset_type === 'SourceCode' && !this.source_code_details?.repository_url) {
    return next(new Error('Repository URL is required for SourceCode assets.'));
  } 
  else if (this.asset_type === 'URL' && !this.url_details?.endpoint) {
    return next(new Error('Endpoint URL is required for URL assets.'));
  }
  
  next();
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;