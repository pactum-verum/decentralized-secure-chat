# Presentation and Demo Video - see [this link](Decentralized%20Secure%20Chat%20Demo.mov).

To make sure there is no CORS issue, configure the IPFS node as follows, and restart it for the changes to take effect:
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

