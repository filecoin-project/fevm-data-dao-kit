/**
 * @param {string} path to file.
 * @param {string} apiKey your API key.
 * @return {object} containing details of the file uploaded.
 */
 // Both file and folder are supported by the upload function
import lighthouse from '@lighthouse-web3/sdk'
const uploadResponse = await lighthouse.upload('/home/cosmos/Desktop/wow.jpg', apiKey); // path, apiKey

/* Returns:
    {
      data: {
        Name: 'flow1.png',
        Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
        Size: '31735'
      }
    }
*/