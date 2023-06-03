// SPDX-License-Identifier: Apache-2.0 and MIT
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Flex, HStack, Button, Text, Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import seedToEcdh from '../utils/seedToECDH';

function Titlebar({setSigner, groupName, groupCid, setGroupCid, setEcdh}) {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Listen for connect/disconnect events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // Check if already connected
      if (window.ethereum.selectedAddress) {
        setAddress(window.ethereum.selectedAddress);
        setIsConnected(true);
      }
    }
  }, []);

  const handleConnect = async () => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the connected address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const connectedAddress = await signer.getAddress();

      regenerateEcdh(signer);

      setAddress(connectedAddress);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const regenerateEcdh = async (signer) => {
    const signature = await signer.signMessage("Sign this to re-generate encryption keys!");

    // Test wallet  RFC 6979 compliance!
    const signatureAgain = await signer.signMessage("Sign this to re-generate encryption keys!");
    if (signature !== signatureAgain) {
        window.alert("Your wallet is not RFC 6979 compliant.\nIt cannot be used with this application!");
        console.log("Non-compliant wallet.");
        return;
    }

    const seed = ethers.keccak256(signature);

    setEcdh(seedToEcdh(seed));
  };

  const handleDisconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setSigner(null);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
      setEcdh(null);
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  return (
    <Flex bg='gray.700' width='100%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
        <Text fontWeight='bold'>Chat</Text>
        <Box display="flex" alignItems='center' >
            <Text>Group: {groupName}</Text>
            {groupCid?<CloseIcon boxSize={3}  ml={2} color="red.500" onClick={() => setGroupCid(null)} cursor='pointer' />:''}
        </Box>
        <HStack>
            <Text>{address && <span>Address: {address}</span>}</Text>
            {isConnected ? (
                <Button colorScheme='purple' size='sm' onClick={handleDisconnect}>Disconnect</Button>
            ) : (
                <Button  colorScheme='pink' size='sm' onClick={handleConnect}>Connect</Button>
            )}
        </HStack>
    </Flex>
  );
}

export default Titlebar;
