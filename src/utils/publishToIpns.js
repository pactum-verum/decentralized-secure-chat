// SPDX-License-Identifier: Apache-2.0 and MIT
export default async function publishToIpns(name, ipnsPrivateKey, ipfs) {
console.log("importing")

console.log("imported", ipnsPrivateKey)
    // Import the private key
    const keyName = 'my-key';
    const privateKeyObject = {
      type: 'Buffer',
      data: Array.from(ipnsPrivateKey)
    };
  
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(
      JSON.stringify(privateKeyObject)
    ).toString('base64')}\n-----END PRIVATE KEY-----`;
  
  console.log('PEM-encoded private key:', privateKeyPem);   
    await ipfs.key.import(keyName, privateKeyPem);

console.log("pk imported")
    // Publish the name to IPNS
    const result = await ipfs.name.publish(name, { key: keyName });

const resolvedCid = await ipfs.name.resolve(result.name);
console.log("result", result);
console.log('Resolved CID:', resolvedCid);
    return result.name;
}
