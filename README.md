# Decentralized Secure Messaging

Libp2p style messaging, but for multiple parties chatting, group management in IPFS-defined groups, encryption and signing of messages.

## Requirements

- The users need to exchange messages in a publish-subscribe manner. Each message can be any content
stored in IPFS. Usually this is text, pictures, videos, documents and folder structures of all of the above.
- The messages have to be signed, to avoid impersonation.
- The messages have to be encrypted by the sender and decrypted by each/any of the recipients.
- Each chat group/topic is a "private club". One person can start a chat group/topic. Then they can sponsor other users by exposing the chat ID. Each new user has to create a request for membership to the given chat ID, and any existing member can add that user.
- There is no removal process as it does not make cryptographic sense when the user has already decrypted an unknown number of messages. Instead, a new chat group/topic should be created with new set of users.
- The keys should be maintained by the ethereum compatible wallet, such as MetaMask, WalletConnect etc. In addition, hardware keys should be allowed to do this, so no keys are stored on the user's computer.
- It is assumed that no member of the chat group is malicious. While the chat group us immune to
outsiders, the members of the group can damage the chat content. Even so, if each user keeps history
of the communication, even an insider cannot erase the content.

## Chat Group Protocol

Each chat group corresponds to an IPFS pubsub topic. Some parts of the communication are invisible to the user (out-of-band) and some are visible. The invisible parts contain updates of the root CID of an IPFS DAG data structure where all membership keys are stored. The visible messages contain the content that users send to each other.

Note that outsiders can publish to the designated IPFS pubsub topic, but without proper membership
their postings would be ignored by the members. On the other hand, members sign the content they
publish, and other members verify these signatures. If signed by a member, the posting is "taken
seriously" and merged with the previous content.

### User Keys

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

### Message Signing

To avoid impersonation, all messages (including the invisible ones) are signed. The signing key is the one generated above. Each message contains the following components:

- Message signature. This allows any member of the chat group to decrypt the message payload and check the signature validity, also recovering the identity of the message creator. However, without decrypting the message and being able to hash it, an eavesdropper could not even detect the identity of the message creator.
- Encrypted payload. The payload contains the encrypted message which is presented to the user. It can only be decrypted by members of the chat group.

### Message Encryption

Each message is symmetrically encrypted using the Common Key, a key common to the entire chat group. As such the message is visible (decryptable) to all members of the chat group, but not visible to any eavesdropper.

### Chat Group Storage

The chat group storage contains a Group Header, Membership Database and Message storage:
- IPFS (and IPLD DAG) is used for the entire storage. 
- The updates to the storage are communicated via IPFS pubsub, by communicating to the root of the entire storage tree. Upon receipt each user merges the presently known content with the new content. Usually, the new content is a superset of the old content, and there is no need for further publishing. In the case that the result of the merge is a superset of the old and the new content, the root of thi superset is re-published to the same topic. This process eventually makes the entire
content available to every participant.
- Upon each IPFS pubsub posting, the participants publish the new root to IPNS. To do so, they have
to have the private key of the IPNS name, which is encrypted and stored in the Group Header.

#### Group Header

The group header is created by the first user, who creates the Common Key, a symmetric encryption key. It contains the following:
- The human readable name of the chat group.
- The private key of the IPNS name of the chat group. This key determines the IPNS name. Note that
the IPFS pubsub topic for the updates of the chat group is the same as the IPNS name of the chat group.
- The signature of the last updater.

Note that the first user creates a membership database, with only one member - himself. 
#### Membership Database

The membership database of the chat group is an enumerable mapping of user IDs (ECC public key) to a structure containing:
- User Alias for convenient human-readable naming. As the user can change his alias, messages should also display the actual user's ECC public key for disambiguation.
- User's ECC public key.
- Encrypted public key structure in the following format:
    - Introducing user's public key. This is the ECC public key of the user that processed the request to add the current user to the chat group. For the user that created the chat group, this is the ECC public key of a temporarily generated throwaway key pair.
    - Encrypted Common Key using symmetric encryption. The key for the symmetric encryption is the ECDH shared secret between the current user and the introducing user. To recover the shared secret, the current user can use his private ket and the above introducing user's public key.

To add a new user,
1. The IPNS name (same as the topic) of the chat group and along with the public key of the new user are packaged into a request.
2. The request is sent to an existing user, which creates the above structure and adds it to the iterable map of users for the chat.
3. The existing user, after verifying the request, stores the new iterable map of users into the new membership database.
4. The existing user publishes to the IPFS pubsub topic the root CID of the updated and signed chat group storage.
5. The existing user updates the IPLD mapping to the new root CID of the signed chat group storage.

Note that if a member receives a pubsub message, he first checks whether it's signed by an existing
member. Otherwise the pubsub message is ignored.

If two or more existing users manage to add new users to the chat or publish messages concurrently, the Chat Group Storage can fork into two or more separate versions. To avoid loss of information, as mentioned earlier, each new transmitted Chat Group Storage is merged with the existing one upon receipt. If the resulting merge is not equivalent to the already received information (may be in different order of membership or different message order), it is re-transmitted, so the other members
can update their information. Such merge is checked for consistency by checking that each user is added by an existing user, except got the user that created the chat. The initial user must match the initial user in the old list. This way, an attacker cannot create an entirely new fake user set. If some user has missed such updates, there is no problem, as either a new user is added by an existing one or a message is encrypted by the Common Key, regardless if the update is transmitted by a previously (yet) unseen user.
#### Message History Storage

Each message updates the Chat Group Storage as follows:
1. The message is signed by the issuer and encrypted by the Common Key. Then it is added at the end
of the list of message history.
2. The resulting new Chat Group Storage is signed by the message issuer and broadcast in the chat
group topic.
3. The IPNS is updated to reflect the root CID of the new signed Chat Group Storage.

The merging process upon receipt of new messages is described in the above section, as the entire
root CIS is broadcast, making no difference in the process.
