import crypto from 'crypto' // Import the built-in crypto module for cryptographic functions
import fs from 'node:fs' // Import the built-in fs module for file system operations

// Generate an RSA key pair synchronously with a modulus length of 2048 bits
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Key size in bits
    publicKeyEncoding: {
        type: 'pkcs1', // Public key encoding type
        format: 'pem', // Output format for the public key
    },
    privateKeyEncoding: {
        type: 'pkcs1', // Private key encoding type
        format: 'pem', // Output format for the private key
    },
})

// Write the private key to certs/private.pem
fs.writeFileSync('certs/private.pem', privateKey)
// Write the public key to certs/public.pem
fs.writeFileSync('certs/public.pem', publicKey)
