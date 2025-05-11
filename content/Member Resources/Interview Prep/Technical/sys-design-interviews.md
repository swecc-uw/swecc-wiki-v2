# System Design Interviews

## Introduction

System design interviews are a critical component of the technical interview process, especially as you progress in your career. This guide introduces the concept, structure, and strategies for approaching system design interviews successfully.

_Note: This content was originally developed for CSE 492j._

## What is a System Design Interview?

System design interviews evaluate your ability to architect complex systems based on a set of requirements. Unlike coding interviews, they are:

- Extremely open-ended
- Focused on your ability to gather and clarify requirements
- Tests of how you evaluate tradeoffs and justify technical decisions
- Less common for intern/new grad positions, but still possible
- Increasingly important as you progress in your career

A typical system design question might be something like: "Design a URL shortening service, which takes a long, complex web address and converts it into a shorter, more manageable link. This shorter URL redirects users to the original destination, making sharing links easier and cleaner."

## Interview Structure and Format

System design interviews typically follow a structure that allows you to demonstrate both breadth and depth of knowledge. While there isn't one "right way" to approach these interviews, and you might not need to touch on all of these areas, the following framework can help you organize your thoughts:

### 1. Requirements Clarification

Start by clarifying both functional and non-functional requirements:

- **Functional requirements** define what your system does and the features it supports
    - Example: "The system must convert long URLs to short, manageable links"
- **Non-functional requirements** cover everything else about system characteristics
    - Example: "The system must support 3 million concurrent users at peak"

### 2. Back-of-Envelope Estimations

Calculating rough estimates helps scope your design appropriately:

- Calculate the expected scale of your system
    - Example: 100M new URLs per month = ~40 URLs/second
- Estimate storage requirements
    - Example: 500 bytes per URL × 100M = 50 GB/month
- Determine read/write ratio
    - Example: 10:1 read:write ratio = ~400 reads/second
- Calculate bandwidth needs
    - Example: 500 bytes × 400 reads/second = 200KB/second

### 3. System Interface Design

Define how your system will be used through APIs and data models:

- Define the API endpoints/interfaces
    - Example: `createShortURL(api_key, original_url, custom_alias=null)`
    - Example: `getOriginalURL(short_url)`
- Specify input/output parameters
    - Example: Returns shortened_url or error message
- Define data models and schemas
    - Example: URL object: `{id, original_url, short_key, created_at, expires_at}`

### 4. High-Level Architecture

Outline the major components and data flows of your system:

- Identify the main components
    - Example: Load balancers, web servers, application servers, databases, caches
- Show how data flows between components
    - Example: Client → Load balancer → Web server → App server → Database
- Specify communication patterns
    - Example: Synchronous API calls, asynchronous message queues
- Select technologies for each component
    - Example: NGINX for load balancing, Redis for caching, PostgreSQL for database

### 5. Detailed Component Design

Dive deeper into the most critical components of your system:

- Focus on 1-2 most important components
    - Example: URL shortening algorithm: MD5 hash + Base62 encoding
- Explain specific algorithms or data structures
    - Example: Bloom filter to check if URL already exists
- Detail database schema with tables and relationships
    - Example: URLs table with indexes on short_key for O(1) lookups
- Describe caching strategy and policies
    - Example: LRU cache for frequently accessed URLs with 80% hit rate

### 6. Addressing Bottlenecks and Edge Cases

Identify and resolve potential issues in your design:

- Identify potential bottlenecks
    - Example: Database becomes read bottleneck at scale
- Propose solutions for each bottleneck
    - Example: Add read replicas, implement caching layer
- Discuss single points of failure
    - Example: Load balancer failover strategy with leader-follower setup
- Handle edge cases
    - Example: URL collision resolution, handling expired URLs

### 7. Trade-off Discussion and Potential Improvements

Demonstrate awareness of the compromises in your design:

- Discuss trade-offs made in your design
    - Example: Consistency vs availability: choosing eventual consistency
- Consider cost vs performance
    - Example: In-memory cache is faster but more expensive than disk storage
- Address security considerations
    - Example: Rate limiting to prevent abuse, input validation
- Suggest future improvements
      - Example: Geographic distribution for lower latency, analytics features

## Next Steps

For more detailed information and examples, continue to [Part 2](sys-design-primer.md).

