# SparkVoid

A full-stack AI chatbot built with Next.js featuring multi-agent conversations, streaming responses, persistent chat history, image uploads, and web-powered research.

## Overview

SparkVoid explores what a production-oriented AI chat application should look like beyond a basic prompt-response interface. It combines real-time streaming, persistent conversations, multimodal input, tool execution, and usage controls into a cohesive user experience.

## Core Features

- Multi-agent chat with specialized assistants
- Streaming responses with structured reasoning
- Persistent conversations with rename, pin, delete, share, and import
- Image uploads using ImageKit
- Web search and scraping through integrated tools
- Public conversation sharing
- Daily usage tracking and quota enforcement

## Engineering Highlights

### Intelligent Agent Pipeline

- Separate Spark and Void agents with different reasoning limits
- Multi-step tool execution with configurable stop conditions
- Provider fallback for improved availability
- Background AI title generation without delaying the first response

### Conversation Experience

- Streaming markdown with live syntax highlighting, LaTeX, Mermaid diagrams, and CJK support
- Reasoning steps are consolidated into a single expandable panel to keep conversations readable
- Regenerate responses for better answer refinement

### Persistence

- PostgreSQL + Drizzle data model for conversations, messages, attachments, and usage
- Cursor-based infinite conversation history
- Public conversation sharing with import/clone support

### Media Handling

- Secure ImageKit uploads using server-generated signatures
- Reference-counted attachment cleanup prevents deleting files still used by shared conversations
- Temporary chats keep uploaded files entirely client-side for privacy

### Performance

- Memoized streaming renderer to reduce unnecessary re-renders
- Zustand store isolation minimizes updates during token streaming
- Debounced search with infinite scrolling for large chat histories

## Technical Decisions

- Usage limits are reset atomically in PostgreSQL using upserts instead of scheduled cron jobs.
- Conversation titles are generated asynchronously so the initial response is never blocked.
- Agent identities are injected into conversation history while preventing the models from exposing those internal markers.

## Challenges

- Integrating ImageKit securely with authenticated uploads
- Designing an expandable reasoning UI instead of rendering every intermediate step
- Managing streamed responses alongside multi-step tool execution
- Keeping shared conversations and attachments consistent without orphaning files

## What I Learned

- Building production-style AI workflows instead of simple chat demos
- Designing streaming interfaces that remain performant
- Managing persistent conversational state
- Combining AI orchestration with modern full-stack architecture
## Summary

SparkVoid is my first Next.js project and a good example of building a real AI product with streaming, persistence, media support, and agent orchestration.
