## Mytail Log Collector Design Document

### 1. Introduction

#### 1.1 Purpose

<!--- Describe the purpose of the HTTP server. Explain what it aims to achieve and its primary use cases.
-->

Mytail log collector is a lightweight log monitoring tool for unix-based servers. It provides an end-point to access host logs in /var/log through a REST API.

#### 1.2 Scope

<!--- Outline the scope of the project, specifying the features and functionality that will be included.
-->

Mytail is not a production ready tool at its current state and its only purpose is for technical demonstration.

#### 1.3 Spike

Based on a brief research on the current tools and best practices, we can find the below alternative approaches to design Mytail log collector as some of the most popular ones. These approaches can be and often are either used together or in a combination.

1. Indexed Log Collection: In this architecture, the logs are indexed into a database utilized for fulltext search like Elasticsearch.

2. Pull-based Log Collection: In this architecture, a central server pulls logs from remote servers.

3. Push-based Log Collection: In this architecture, agents are installed on the remote hosts and they're tasked with piping and forwarding the host logs to a central log collector.

For the sake of technical demonstrations and the limited scope of this project, we've decided to pick a very minimal and straighforward approach and simply read the logs using the "tail" command which is part of all GNU "coreutils" and hence installed on all Linux distributions by default.

### 2. System Overview

Mytail uses a pool of child processes to use the "tail" command to retrieve logs from the end of files.

### 3. Requirements

#### 3.1 Functional Requirements

Expose a REST API that can be used to retrieve specific logs on the host machine.
It requires the ability to choose which log file, how many lines from its end, and what keyword to filter the result by.

#### 3.2 Non-Functional Requirements

The non-functional requirements:

- Handle large files reasonably
- Minimal External Dependencies

### 4. Architecture and Design

#### 4.1 System Architecture

Mytail is a simple http server with one end-point. The end-point uses a process pool to delegate its tasks to "tail" command and OS, which have been perfected for the task they're doing and are generally faster than the alternative, e.g. Opening and seeking to the end of file and reading from there inside the server.

#### 4.2 Component Design

1. Process Pool:
   A component that makes sure the host machine is not overwhelmed even if the load on the server is high.
2. Http Server:
   Responsible for serving requests
