# Messaging

Libp2p style messaging, group management in IPFS-defined groups, encryption of messages.

## Requirements

- The users need to exchange messages in a publish-subscribe manner. This feature already exists in IPFS.
- The messages have to be signed, to avoid impersonation.
- The messages have to be encrypted bu the sender and decrypted by each/any of the recipients.
- Each chat group/topic is a "private club". One person can start a chat group/topic. Then they can sponsor other users by exposing the chat ID. Each new user has to create a request for membership to the given chat ID, and any existing member can add that user.
- There is no removal process as it does not make cryptographic sense when the user has already decrypted an unknown number of messages. Instead, a new chat group/topic should be created with new set of users.
- The keys should be maintained by the ethereum compatible wallet, such as MetaMask, WalletConnect etc. In addition, hardware keys should be allowed to do this, so no keys are stored on the user's computer.


## Message Protocol

Each chat group corresponds to an IPFS pubsub topic. Some messages are invisible to the user (out-of-band) and some are visible. The invisible messages contain updates of the root CID of an IPFS DAG data structure where all membership keys are stored. The visible messages contain the content that users send to each other.

## User Keys

Each user's asymmetric key pair should be deterministically generated from an Ethereum compatible wallet address, so that:
- it is next to impossible for someone else to generate the same key pair,
- the user can switch to another device and re-generate the same key pair and continue to work from there.

To achieve the above the key pair is generated from deterministically generated "entropy". This entropy is created as follows:
1. The user signs a standard message using the private key corresponding to his Ethereum-compatible address for this purpose, which uses Elliptic Curve (EC) Signatures using the well-known EC curve "secp256k1". For this, any Ethereum wallet can be used, including hardware wallets.
2. The signing wallet has to be RFC 6979 compliant in order to repeatedly generate unique signatures from the same message and private key. To test this, we ask the user to sign the same message again and check of the two signatures match.
3. The resulting signature is hard (next to impossible) to guess since otherwise anyone could generate digital signatures.
4. The resulting signature is hashed using the KECCAK256 method. This hash is used as "Deterministic Entropy" (what an oxymoron :) ).
5. A new Elliptic Curve keypair is deterministically generated using the above Deterministic Entropy. We need this because the Ethereum Compatible wallets do not allow generation of Elliptic Curve Diffie-Hellman (ECDH) Shared Secrets, which we need in the next steps. In the future, once the wallets implement ECDH which has been a numerously requested feature, the Ethereum key can be used directy for this purpose. 

In addition to safety, the above procedure provides extra convenience to the user: instead of requiring an approval for each message sent, only one approval is requested when a session is initiated.

## Message Signing

To avoid impersonation, all messages (including the invisible ones) are signed. The signing key is the one generated above. Each message contains the following components:

- Message signature. This allows any member of the chat group to decrypt the message payload and check the signature validity, also recovering the identity of the message creator. However, without decrypting the message and being able to hash it, an eavesdropper could not even detect the identity of the message creator.
- Encrypted payload. The payload contains the encrypted message which is presented to the user. It can only be decrypted by members of the chat group.

## Message Encryption

Each message is symmetrically encrypted using the Common Key, a key common to the entire chat group. As such the message is visible (decryptable) to all members of the chat group, but not visible to any eavesdropper.

## Chat Group Storage

The membership database of the chat group is an enumerable mapping of user IDs (ECC public key) to a structure containing:
- User Alias for convenient human-readable naming. As the user can change his alias, messages should also display the actual user's ECC public key for disambiguation.
- User's ECC public key.
- Encrypted public key structure in the following format:
    - Introducing user's public key. This is the ECC public key of the user that processed the request to add the current user to the chat group. For the user that created the chat group, this is the ECC public key of a temporarily generated key pair.
    - Encrypted Common Key using symmetric encryption. The key for the symmetric encryption is the ECDH shared secret between the current user and the introducing user. To recover the shared secret, the current user can use his private ket and the above introducing user's public key.

To add a new user,
1. the topic of the chat group and along with the public key of the new user are packaged into a request.
2. The request is sent to an existing user, which creates the above structure and adds it to the iterable map of users for the chat.
3. The new iterable map of users is stored into an IPFS DAG and it's CID is broadcasted as an invisible message to the chat group.

If two or more existing users manage to add new users to the chat concurrently, this iterable map can fork into two or more separate versions. To avoid such problems, each new transmitted iterable map of users should be merged with the existing one upon receipt. A good samaritan can occasionally re-transmit the CID of the latest chat group storage, and why not do this with each message transmission. All users will then check if they have the latest version, and if not, they will merge it. Such merge is checked for consistency by checking that each user is added by an existing user, except got the user that created the chat. The initial user must match the initial user in the old list. This way, an attacker cannot create an entirely new fake user set. If some user has missed such updates, there is no problem, as the next update message is encrypted by the Common Key, regardless if the update is transmitted by a previously (yet) unseen user.
## Message History Storage

The message history is not stored by the "system". Each user can store the message history in its raw format into an IPFS DAG. The root of this DAG can be sent to anyone via any medium such as email, but only decrypted and signature-checked by members of the chat group.

When the user is offline and not subscribed to the pubsub group, messages sent are missed by that user. This implementation does not take responsibility of centrally storing such messages, but it can be extended to do so. As this implementation is fully decentralized, the responsibility for keeping the data (pinning) should be taken by some interested party. Unpinned data can disappear and produce an incomplete message history.

## Implementation

The membership keys of each group are stored in an IPFS DAG. All messages are sent via IPFS PubSub. Optional message history can be pinned to IPFS on user's request. There is no centralized server.