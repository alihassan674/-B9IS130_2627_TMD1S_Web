# Requirement Analysis & Project Plan

**Project:** TravelLog — *Trip journal with places, photos, notes, and budgets*

---

## 1. Problem Definition & Proposed Solution

### Problem
Travelers’ memories, photographs, notes, locations, and spending records are often spread across different tools. This makes it difficult to reconstruct a trip in order, review spending, and share a complete travel story.

### Proposed Solution
TravelLog is a web application where users can organize trip information in one place, view it as a timeline, and share a curated trip page with others.

### Problem Statement (Draft)
Travelers often record their experiences using a combination of photographs, notes, maps, social media posts, and separate budgeting tools. As a result, information about a single trip can become fragmented, making it difficult to preserve memories in chronological order, review places visited, and understand how much was spent.

Existing social platforms may support sharing photographs and short updates, but they are not necessarily designed to provide a structured, personal trip journal that combines travel entries, locations, photographs, notes, and budget information.

TravelLog proposes a web-based trip journaling system that enables users to create and manage trips, document experiences through dated entries, organize places and photographs, record expenses, and present their journey through a chronological timeline. Users will also be able to share selected trip pages with others while retaining control over the visibility of their personal information.

---

## 2. Stakeholders & Users

> *A stakeholder is anyone who uses, is affected by, or has an interest in the system.*

### Proposed User Roles
- **Trip Owner:** An authenticated user who creates and manages their own trips.
- **Trip Viewer:** A person who visits a shareable page without necessarily creating an account.

### Stakeholder Needs
- **Trip Owner:**
  - Needs a simple way to record and organize travel experiences.
  - Needs to decide what information appears on a shared page.
- **Trip Viewer:**
  - Needs to access a shared page easily, without seeing private trips or private information.
- **Assessor:**
  - Needs evidence that the system meets its requirements and that technical decisions are justified.

---

## 3. Functional Requirements

> **Note:** Functional requirements describe what the system must do. Each requirement is assigned a unique ID to ensure traceability across implementation, API endpoints, and test cases.

**Priority Definitions:**
- **Must:** Core first-version functionality.
- **Should:** Valuable functionality to be implemented if time allows.

### Requirements Table

| ID | Requirement | Priority |
| :--- | :--- | :---: |
| **FR-01** | The system shall allow a visitor to register for an account. | `Must` |
| **FR-02** | The system shall allow a registered user to sign in and sign out. | `Must` |
| **FR-03** | The system shall allow an authenticated user to create a trip with a title, destination, start date, and end date. | `Must` |
| **FR-04** | The system shall allow a trip owner to view, edit, and delete their own trips. | `Must` |
| **FR-05** | The system shall allow a trip owner to create dated journal entries containing a title, notes, and a place. | `Must` |
| **FR-06** | The system shall allow a trip owner to edit and delete their own journal entries. | `Must` |
| **FR-07** | The system shall display a trip’s journal entries in chronological order as a timeline. | `Must` |
| **FR-08** | The system shall allow a trip owner to upload photographs and associate them with a trip or journal entry. | `Must` |
| **FR-09** | The system shall allow a trip owner to record expenses with an amount, currency, date, category, and description. | `Must` |
| **FR-10** | The system shall display recorded expenses and calculate the total recorded trip spending. | `Must` |
| **FR-11** | The system shall allow a trip owner to enable or disable sharing for a trip. | `Must` |
| **FR-12** | The system shall provide a shareable URL for a trip whose sharing is enabled. | `Must` |
| **FR-13** | The system shall allow a visitor to view the shared trip page without signing in. | `Must` |
| **FR-14** | The system shall prevent visitors from viewing trips that are private or not shared. | `Must` |
| **FR-15** | The system shall allow a trip owner to search or filter their trips by title or destination. | `Should` |
| **FR-16** | The system shall allow a trip owner to choose which trip details are displayed on the shared page. | `Should` |
