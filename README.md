# RigFlow - Digital Field Operations (Enhanced)

This project is an enhanced version of the RigFlow React application, incorporating advanced features for managing oil and gas field operations based on a detailed strategic proposal.

## Key Features

-   **Role-Based Access Control:** Distinct interfaces and permissions for Technicians, Supervisors, Admins, and Executives.
-   **Geospatial Command Center:** An interactive map to view jobs and assets. Admins can edit all job details (budget, POC, status, documents) directly from a side panel on the map.
-   **Comprehensive Job Lifecycle:** Full workflow from job creation, dispatch, field data capture, supervisor approval, and invoicing.
-   **Job Budgeting & Cost Tracking:** Set budgets for jobs and track real-time costs with a detailed breakdown of labor (day/night shifts), materials, and equipment usage on the Job Details page.
-   **Industry-Specific Forms:**
    -   **Timesheets:** Capture separate Day and Night shift hours.
    -   **Expenses:** Dynamic form for logging mileage (auto-calculated), per diem, billable assets (trucks), fuel, and more.
    -   **Safety Forms:** JSA, Incident Reports, and Safety Meeting Logs.
    -   **Operational Forms:** Daily Drilling Reports, Equipment Inspection Checklists, and Materials Transfer Logs (BOL).
-   **Dynamic User Management:** Admins can create new users directly from the User Management interface.
-   **Organized UI:** A redesigned, collapsible sidebar organizes tasks into logical groups like "Field Forms," "Management," and "Administration."
-   **Approval Workflow with Audit Trail:** Supervisors can review, edit, and approve/reject submissions. All edits are logged.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python 3.x (to run this setup script)
- npm or yarn

### Installation
If you wish to run it locally, please follow these steps.

1.  **Navigate into the created directory**
    ```bash
    cd rigflow-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.
