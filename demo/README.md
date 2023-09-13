# Presentation and Demo Video

Download from [this link](Decentralized%20Secure%20Chat%20-%20HD%20720p.mov).

Or view on YouTube [here](https://youtu.be/7tlaApydUp0).

# Setup

To make sure there is no CORS issue, configure the IPFS node as follows, and restart it for the changes to take effect:
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

To run the demo, start the static content development server:
```
pnpm install
pnpm start
```

then visit the following URL with at least two different browsers with the MetaMask extension installed on them:
```
http://localhost:3000
```
