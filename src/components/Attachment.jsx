import React, { useState, useEffect } from 'react';
//import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Document, Page } from 'react-pdf';
import 'pdfjs-dist/webpack';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
//import marked from 'marked';
import { parse as marked } from 'marked';
import ipfsClient from 'ipfs-http-client';

const Attachment = ({ attachment }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const file = await window.ipfs.get(attachment.ipfsHash);
        const content = await file[0].content.toString();
        setContent(content);
      } catch (error) {
        console.error(error);
      }
    };

    if (attachment.ipfsHash) {
      fetchContent();
    }
  }, [attachment.ipfsHash]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const renderImage = () => (
    <img src={attachment.url} alt={attachment.name} className="attachment-image" />
  );

  const renderVideo = () => (
    <video src={attachment.url} controls className="attachment-video" />
  );

  const renderAudio = () => (
    <audio src={attachment.url} controls className="attachment-audio" />
  );

  const renderPDF = () => (
    <Document file={attachment.url} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );

  const renderText = () => (
    <pre className="attachment-text">{content}</pre>
  );

  const renderCode = () => (
    <pre className="attachment-code">
      <code
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(content, Prism.languages.javascript, 'javascript'),
        }}
      />
    </pre>
  );

  const renderMarkdown = () => (
    <div
      className="attachment-markdown"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    />
  );

  const renderUnknownFile = () => (
    <>
      <button onClick={togglePopup} className="attachment-link">
        {attachment.name}
      </button>
      {showPopup && (
        <div className="attachment-popup">
          <div className="attachment-popup-content">
            <h3>{attachment.name}</h3>
            {attachment.type === 'video' && renderVideo()}
            {attachment.type === 'audio' && renderAudio()}
            {attachment.type === 'pdf' && renderPDF()}
            {attachment.type === 'text' && renderText()}
            {attachment.type === 'code' && renderCode()}
            {attachment.type === 'markdown' && renderMarkdown()}
            <a href={attachment.url} download={attachment.name} className="attachment-download-link">
              Download
            </a>
            <button onClick={togglePopup} className="attachment-popup-close">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="attachment">
      {attachment.type === 'image' ? renderImage() : renderUnknownFile()}
    </div>
  );
};

export default Attachment;
