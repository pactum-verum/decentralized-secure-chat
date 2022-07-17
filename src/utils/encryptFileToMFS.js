// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';

export default function encryptFileToMFS(file, path, commonKey) {
    const cipher = 'aes-256-ctr';
    const crypter = crypto.createCipher(cipher, Buffer.from(commonKey, 'hex'));
    let encfile = Buffer.from([]);

    const reader  = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onerror = () => { reject("Error loading file" + file.name); }
        reader.onload = (e) => {
            const content = e.target.result;
            //encfile = Buffer.concat([encfile, new Uint8Array(content)]);
            encfile = Buffer.concat([encfile, crypter.update(Buffer.from(content, 'hex'))]);
        }
        reader.onloadend = async () => {
            encfile = Buffer.concat([encfile, crypter.final()]);
            await window.ipfs.files.write(path + file.name, encfile, { create: true, parents: true, truncate: true })
                .catch(error => { console.error(error); window.alert(error.toString()); } );
            resolve(true);
        }
        reader.readAsArrayBuffer(file);
    });
};
