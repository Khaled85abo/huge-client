# Workspace Management Application with Semantic Search and Resource Embedding

Welcome to the **Workspace Management Application**, a comprehensive solution designed to enhance productivity and organization through advanced workspace customization and semantic search capabilities. This application empowers users to create personalized workspaces, manage boxes and items efficiently, and enrich their data with embedded resources such as images, PDFs, and videos. By leveraging cutting-edge AI technologies and efficient data processing methods, the application ensures that information retrieval is intuitive, fast, and accurate.

## Table of Contents

- [Features](#features)
  - [Custom Workspaces and Boxes](#custom-workspaces-and-boxes)
  - [Intelligent Item Management](#intelligent-item-management)
  - [Resource Embedding and Management](#resource-embedding-and-management)
  - [Advanced Semantic Search](#advanced-semantic-search)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Search Engine](#search-engine)
  - [Resource Processing](#resource-processing)
  - [Task Queue](#task-queue)
- [Resource Embedding Strategies](#resource-embedding-strategies)
  - [1. Unstructured PDF Embedding](#1-unstructured-pdf-embedding)
  - [2. RecursiveCharacterTextSplitter for Texts](#2-recursivecharactertextsplitter-for-texts)
  - [3. Image Processing with gpt-4o-mini](#3-image-processing-with-gpt-4o-mini)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
- [Usage](#usage)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Custom Workspaces and Boxes

- **Personalized Workspaces**: Users can create multiple workspaces tailored to different projects or organizational needs.
- **Box Creation**: Within each workspace, users can add boxes either by scanning a box name with a camera or manually entering the details.
- **Workspace Organization**: Provides a hierarchical structure for better organization and management of items and resources.

### Intelligent Item Management

- **Item Addition via Scanning**: Utilize a camera in conjunction with an AI classification model to recognize and add items automatically.
- **Manual Item Entry**: Allows users to add items manually if scanning is not feasible.
- **Classification Model Integration**: Enhances the accuracy and speed of item recognition and addition.

### Resource Embedding and Management

- **Attach Various Resources**: Users can attach images, PDFs, and videos to each workspace or box.
- **Embedded Resources**: Resources are processed and embedded to enhance information retrieval and context.
- **Resource Organization**: Resources are linked to specific workspaces for easy access and management.

### Advanced Semantic Search

- **Keyword Search**: Allows users to search for items and resources using specific keywords.
- **Semantic Search**: Leverages a Weaviate vector database to enable context-aware search queries.
- **Comprehensive Results**: Combines embedded resources with items to provide detailed answers to user queries.
- **Improved Retrieval**: Enhances the ability to find relevant information quickly, even with vague or complex queries.

### Responsive Background Processing

- **Celery Integration**: Implements Celery as a task queue to handle resource processing in the background.
- **Asynchronous Tasks**: Ensures that resource-intensive tasks do not hinder the responsiveness of the application.
- **Efficient Resource Management**: Handles embedding and processing of resources without impacting user experience.

---

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces, allowing for the creation of interactive and dynamic UI components.
- **Redux Toolkit**: A set of tools that simplifies Redux development for state management, ensuring predictable state updates and easy debugging.

### Backend

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **SQLAlchemy**: An SQL toolkit and Object-Relational Mapping (ORM) library for Python, providing a full suite of well-known enterprise-level persistence patterns.
- **Python**: The programming language used for backend development, chosen for its readability and vast ecosystem.

### Database

- **PostgreSQL**: A powerful, open-source object-relational database system with a strong reputation for reliability and performance.

### Search Engine

- **Weaviate Vector Database**: An AI-native vector database that allows for efficient semantic search and similarity-based retrieval.

### Resource Processing

- **Unstructured**: For flexible and schema-free handling of PDFs, allowing for the extraction and embedding of content without predefined data models.
- **LangChain's RecursiveCharacterTextSplitter**: A tool to split long texts into manageable chunks while preserving semantic meaning.
- **gpt-4o-mini**: An AI model used to generate textual descriptions from images, enhancing their searchability within the application.

### Task Queue

- **Celery**: An asynchronous task queue/job queue based on distributed message passing, used for handling background tasks and resource processing.

---

## Resource Embedding Strategies

### 1. Unstructured PDF Embedding

**What is it?**

Unstructured PDF embedding involves processing PDF documents without relying on predefined schemas or structures. The content is treated as raw text, allowing for the extraction of information regardless of the document's formatting.

**Advantages:**

- **Flexibility**: Can handle a wide variety of PDF formats and structures.
- **Simplicity**: Eliminates the need for complex parsing rules or templates.
- **Comprehensive Indexing**: Ensures that all text content within the PDF is accessible for search and retrieval.

### 2. RecursiveCharacterTextSplitter for Texts

**What is it?**

The `RecursiveCharacterTextSplitter` from the `langchain.text_splitter` module is a tool that splits long text documents into smaller chunks based on character count, while attempting to preserve semantic coherence.

**Advantages:**

- **Manageable Text Chunks**: Facilitates the handling and processing of large texts by breaking them into sizes suitable for embedding and indexing.
- **Semantic Preservation**: Attempts to split text at logical boundaries (e.g., sentences or paragraphs) to maintain context.
- **Improved Search Performance**: Smaller, context-rich text segments enhance the accuracy and efficiency of semantic search queries.

### 3. Image Processing with gpt-4o-mini

**What is it?**

`gpt-4o-mini` is an AI model designed to interpret images and generate descriptive textual representations of their content.

**Advantages:**

- **Enhanced Searchability**: Converts visual information into text, making images searchable through text-based queries.
- **Contextual Understanding**: Captures nuances and details within images that simple tagging might miss.
- **Integration with Semantic Search**: Allows image content to be included in semantic search results, providing a more comprehensive retrieval experience.

---

## App demos

### [Create Workspace, Create Box, Add items, Search](demos/add_items.mp4)


<div style="width: 100%; display:grid; place-items: center;">
<video src="demos/add_items.mp4" controls="controls" style="max-width: 30%;">
    Your browser does not support the video tag.
</video>
</div>

### [Search items with multiple languages](demos/search_kitchen.mp4)


<div style="width: 100%; display:grid; place-items: center;">
<video src="demos/search_kitchen.mp4" controls="controls" style="max-width: 30%;">
    Your browser does not support the video tag.
</video>
</div>

### [Add resources](demos/add_resources.mp4)


<div style="width: 100%; display:grid; place-items: center;">
<video src="demos/add_resources.mp4" controls="controls" style="max-width: 30%;">
    Your browser does not support the video tag.
</video>
</div>


