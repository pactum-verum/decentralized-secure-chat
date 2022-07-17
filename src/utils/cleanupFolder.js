// SPDX-License-Identifier: Apache-2.0 and MIT
import rootPath from "./rootPath";

export default async function cleanupFolder() {
    try { await window.ipfs.files.rm(rootPath, { recursive: true }); } catch(e) { console.log("Error: ", e) };
    await window.ipfs.files.mkdir(rootPath, { parents : true });
    // const e = await window.ipfs.files.stat(rootPath, { hash: true });
    // return e.cid;
}
