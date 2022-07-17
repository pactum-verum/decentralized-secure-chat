// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; 

function User({userAddress, user, address}) {
if ((address === userAddress) !== (address.toLowerCase() === userAddress.toLowerCase())) window.alert("Bug: \n" + address + "\n" + userAddress);
    return (
        <tr>
            <td>{address.toLowerCase() === userAddress.toLowerCase() && "* "}{user.alias === "" ? "<no alias>": user.alias}</td>
            <td>{userAddress}</td>
        </tr>
    );
}

export default User;