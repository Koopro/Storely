const express = require('express');
const ApiKey = require('../models/ApiKey'); // Adjust the path to your UserApiKey model

const apiKeyMiddleware = async (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'];
  
  if (!providedApiKey) {
    return res.status(401).json({ message: 'API key required' });
  }

  try {
    const apiKeyDocument = await ApiKey.findOne({ key: providedApiKey });
    
    if (!apiKeyDocument) {
      console.log('Invalid API key.');
      return res.status(403).json({ message: 'Invalid API key' });
    }
    
    // Check for key expiry (if you have an expiresAt field)
    if (apiKeyDocument.expiresAt && apiKeyDocument.expiresAt < new Date()) {
      console.log('Expired API key.');
      return res.status(403).json({ message: 'API key expired' });
    }
    
    console.log('API key is valid. Proceeding...');
    next();
  } catch (error) {
    console.error('Error during API key validation:', error);
    res.status(500).json({ message: 'Internal server error during API key validation' });
  }
};

module.exports = apiKeyMiddleware;
