// SPDX-License-Identifier: Apache-2.0 and MIT
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Flex, HStack, Button, Text } from '@chakra-ui/react'

function Titlebar({setSigner, groupName}) {
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

      setAddress(connectedAddress);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setSigner(null);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  return (
    <Flex bg='gray.700' width='100%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
        <Text fontWeight='bold'>Chat</Text>
        <Text>Group: {groupName}</Text>
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
