// SPDX-License-Identifier: Apache-2.0 and MIT
import { ethers } from 'ethers';

export default function groupNameToTopic(groupName) {
    return ethers.keccak256(ethers.toUtf8Bytes("DSC:"+groupName)).toString();
}