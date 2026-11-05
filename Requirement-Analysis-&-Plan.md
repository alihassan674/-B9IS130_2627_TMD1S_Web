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

---

## 4. Non-Functional Requirements

> **Non-Functional Requirements (NFRs)** describe how well the system should work—covering security, privacy, performance, usability, reliability, and maintainability.

### Requirements Table

| ID | Quality Attribute | Requirement Specification |
| :--- | :--- | :--- |
| **NFR-01** | Security | Users must only create, read, update, or delete trips and entries they own, except for explicitly shared read-only pages. |
| **NFR-02** | Privacy | Trips shall be private by default. Sharing must be enabled by the owner. |
| **NFR-03** | Performance | Under the project’s test conditions, the main trip list and trip detail pages should load within 3 seconds for 95% of requests. |
| **NFR-04** | Usability | The main trip creation and journal-entry workflows shall be usable without instructions or documentation. |
| **NFR-05** | Responsive Design | The application shall support usable layouts at mobile, tablet, and desktop viewport sizes. |
| **NFR-06** | Accessibility | Forms, navigation, and interactive controls shall support keyboard operation and use appropriate labels and contrast. |
| **NFR-07** | Reliability | The system shall provide clear error messages when a request fails and shall not silently discard unsaved user input. |
| **NFR-08** | Maintainability | The application shall use separated frontend, backend, and data-access responsibilities, with documented setup instructions. |
| **NFR-09** | Data Validation | The backend shall validate incoming data, including trip dates, expense amounts, and required fields. |
| **NFR-10** | Deployment & Security | The deployed application shall use environment variables for configuration and shall not expose secrets in client-side code or the Git repository. |

> [!NOTE]
> **Performance Target Note:** The 3-second load time target is a proposed project benchmark for testing, rather than an already measured metric. Actual response times will be tested, evaluated, and reported during project verification.

---

## 5. Project Scope

### First Version (MVP / In-Scope)
- User registration and authentication
- Create, view, update, and delete trips
- Trip details (title, destination, and dates)
- Dated journal entries with places and notes
- Photograph uploads
- Chronological trip timeline
- Expense recording and trip spending totals
- Private trips and owner-controlled sharing
- Public read-only shared trip pages
- Responsive interface across mobile, tablet, and desktop
- Backend validation and authorization
- Deployment and testing

---

## 6. Research & Feasibility Analysis

### Initial Feasibility Assessment

| Feasibility Area | Initial Assessment |
| :--- | :--- |
| **Technical** | MERN supports the required frontend, REST API, and database. Image storage and deployment need to be selected. |
| **Economic** | A student project can potentially use free tiers, but storage and hosting limits must be checked before deployment. |
| **Operational** | The main workflows—create trip, add entry, view timeline, record expense, share page—are familiar to travelers. This still needs user feedback. |
| **Schedule** | The core system is achievable if advanced features are excluded and deployment begins early. |
| **Legal / Privacy** | The app should avoid exposing private trip information or images. We should consider consent and privacy when sharing photographs and location details. |

### Research Plan

Key research questions guiding the project investigation:
1. How do travelers currently record their trips?
2. What makes a trip journal useful beyond a standard photo album or social media post?
3. What do users expect from a shareable trip page?
4. What privacy concerns arise when sharing dates, photographs, and places?
5. What are the storage and deployment limits of the services selected for the project?

---

## 7. User Stories & Acceptance Criteria

### User Story 1 — Create a Trip
> **As a** registered traveler,  
> **I want to** create a trip with a destination and dates,  
> **So that** I can organize my travel memories in one place.

**Acceptance Criteria:**
- A signed-in user can open the create-trip form.
- The user must provide a trip title, destination, start date, and end date.
- The end date cannot be earlier than the start date.
- The trip is saved and appears in the user’s trip list.
- Another user cannot access the trip unless it is explicitly shared.

### User Story 2 — Add a Journal Entry
> **As a** trip owner,  
> **I want to** add a dated entry with a place, notes, and photographs,  
> **So that** I can preserve what happened during my trip.

**Acceptance Criteria:**
- The owner can add an entry to one of their own trips.
- The entry includes a date, place, and notes.
- The owner can attach photographs.
- The entry appears on the trip timeline in chronological order.
- The owner can edit or delete the entry.

### User Story 3 — Share a Trip
> **As a** trip owner,  
> **I want to** enable sharing and receive a URL,  
> **So that** friends and family can view my travel story.

**Acceptance Criteria:**
- A trip is private by default.
- The owner can enable sharing.
- The system provides a shareable URL.
- A visitor can view the shared page without signing in.
- A visitor cannot edit the trip.
- When sharing is disabled, the public page is no longer accessible.

> [!NOTE]
> **Traceability Note:** These user stories directly translate into frontend interfaces, backend endpoints, and verification test cases in subsequent development phases.

