'use client';

import React from 'react';

const TTSPipelineDiagram: React.FC = () => {
  return (
    <div className="pipeline-diagram">
      <svg viewBox="0 0 900 700" className="pipeline-svg">
        {/* Define arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
           refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>

        {/* Row 1: Initial Flow */}
        {/* Markdown Post */}
        <g transform="translate(50, 50)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">📄</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">Markdown Post</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">.md file</text>
        </g>

        {/* Arrow */}
        <line x1="210" y1="90" x2="250" y2="90" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* Text Extraction */}
        <g transform="translate(250, 50)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="white" stroke="#e0e0e0" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">📝</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">Text Extraction</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Remove code, images, links</text>
        </g>

        {/* Arrow */}
        <line x1="410" y1="90" x2="450" y2="90" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* NLP Processing */}
        <g transform="translate(450, 50)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="white" stroke="#e0e0e0" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">🧠</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">NLP Processing</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Expand "I've" to "I have"</text>
        </g>

        {/* Arrow down */}
        <line x1="530" y1="130" x2="530" y2="160" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* Decision Diamond: Text > 4096 chars? */}
        <g transform="translate(530, 210)">
          <polygon points="0,-50 50,0 0,50 -50,0" 
                   fill="white" stroke="#6366f1" strokeWidth="2"/>
          <text x="0" y="-5" textAnchor="middle" fontSize="13" fontWeight="500" fill="#4338ca">
            Text &gt; 4096
          </text>
          <text x="0" y="10" textAnchor="middle" fontSize="13" fontWeight="500" fill="#4338ca">
            chars?
          </text>
        </g>

        {/* Yes branch */}
        <line x1="480" y1="210" x2="380" y2="320" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="410" y="265" fontSize="12" fill="#6366f1" fontWeight="500">Yes</text>

        {/* No branch */}
        <line x1="580" y1="210" x2="680" y2="320" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="630" y="265" fontSize="12" fill="#6366f1" fontWeight="500">No</text>

        {/* Chunking Logic */}
        <g transform="translate(250, 320)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="white" stroke="#e0e0e0" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">✂️</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">Chunking Logic</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Split by paragraphs/sentences</text>
        </g>

        {/* Arrow from chunking to API */}
        <line x1="410" y1="360" x2="550" y2="360" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* OpenAI TTS API */}
        <g transform="translate(550, 320)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">🎵</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">OpenAI TTS API</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Generate MP3</text>
        </g>

        {/* Arrow down from API */}
        <line x1="630" y1="400" x2="630" y2="430" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* Decision Diamond: Multiple chunks? */}
        <g transform="translate(630, 480)">
          <polygon points="0,-50 50,0 0,50 -50,0" 
                   fill="white" stroke="#6366f1" strokeWidth="2"/>
          <text x="0" y="-5" textAnchor="middle" fontSize="13" fontWeight="500" fill="#4338ca">
            Multiple
          </text>
          <text x="0" y="10" textAnchor="middle" fontSize="13" fontWeight="500" fill="#4338ca">
            chunks?
          </text>
        </g>

        {/* Yes branch to FFmpeg */}
        <line x1="580" y1="480" x2="380" y2="580" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <text x="460" y="530" fontSize="12" fill="#6366f1" fontWeight="500">Yes</text>

        {/* No branch to S3 */}
        <line x1="680" y1="480" x2="750" y2="580" 
              stroke="#6b7280" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>
        <text x="710" y="530" fontSize="12" fill="#6366f1" fontWeight="500">No</text>

        {/* FFmpeg Concat */}
        <g transform="translate(250, 580)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="white" stroke="#e0e0e0" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">🔗</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">FFmpeg Concat</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Merge chunks</text>
        </g>

        {/* Arrow from FFmpeg to S3 */}
        <line x1="410" y1="620" x2="450" y2="620" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* S3 Upload */}
        <g transform="translate(450, 580)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="white" stroke="#e0e0e0" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">☁️</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">S3 Upload &amp;</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">Manifest Update</text>
        </g>

        {/* Arrow to Audio Player */}
        <line x1="610" y1="620" x2="650" y2="620" 
              stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>

        {/* Audio Player UI */}
        <g transform="translate(650, 580)">
          <rect x="0" y="0" width="160" height="80" rx="8" 
                fill="#d1fae5" stroke="#10b981" strokeWidth="2"/>
          <text x="80" y="25" textAnchor="middle" fontSize="20">▶️</text>
          <text x="80" y="50" textAnchor="middle" fontSize="14" fontWeight="600">Audio Player UI</text>
          <text x="80" y="68" textAnchor="middle" fontSize="12" fill="#6b7280">React + HTML5</text>
        </g>
      </svg>
    </div>
  );
};

export default TTSPipelineDiagram;