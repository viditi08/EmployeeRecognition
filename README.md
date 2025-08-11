# Employee Recognition Platform API

This is a GraphQL-based API for a real-time employee recognition system. It allows employees to send kudos to one another, provides analytics for leadership, and supports real-time notifications through WebSockets.

---

## ✨ Core Features

* **Peer-to-Peer Recognition**: Send recognitions with messages and emojis.
* **Visibility Control**: Recognitions can be `PUBLIC`, `PRIVATE`, or `ANONYMOUS`.
* **Role-Based Access Control (RBAC)**: Granular permissions for `EMPLOYEE`, `MANAGER`, `HR`, and `ADMIN` roles ensure data security.
* **Real-Time Notifications**: Utilizes GraphQL Subscriptions over WebSockets for instant updates.
* **Comprehensive Analytics**: Provides detailed analytics on teams, keywords, and user engagement.
* **Slack Integration**: Notifies a configured Slack channel when new recognitions are sent.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm

### Installation & Setup

1.  **Clone the repository.**

2.  **Navigate into the project directory and install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables (Optional):**
    To enable the Slack integration, create a `.env` file in the root directory. Add your Slack Webhook URL placeholder.
    ```env
    # .env
    SLACK_WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL"
    ```

### Running the Server

* **For development with live-reloading:**
    ```sh
    npm run dev
    ```
    Once running, the GraphQL API is available on port 4000. You can connect to it using any GraphQL client.

* **For production:**
    First, build the TypeScript project:
    ```sh
    npm run build
    ```
    Then, start the server:
    ```sh
    npm run start
    ```

---

## 🛠️ Technology Stack

* **Backend**: Node.js with Express.js
* **API**: GraphQL with Apollo Server
* **Real-time**: WebSockets (`graphql-ws` and `graphql-subscriptions`)
* **Language**: TypeScript
* **Core Libraries**: `uuid`, `dotenv`

---

## 🎨 API Design (GraphQL)

The API is structured around a clear and extensible GraphQL schema.

### Key Types

* **User**: Represents an employee with fields for `name`, `email`, `role`, and `team`.
* **Team**: Represents a department with a `name` and list of `members`.
* **Recognition**: The core object, containing the `message`, `emoji`, sender (`from`), receiver (`to`), and `visibility`.
* **Analytics**: A collection of types like `TeamAnalytics` and `KeywordAnalytics` to provide structured reporting data.

### Main Operations

* **Queries**:
    * `getMyProfile`: Fetches the current user's details.
    * `getTeam(id: ID!)`: Retrieves a team's information.
    * `getAnalytics(input: AnalyticsInput!)`: Returns comprehensive analytics data for authorized users.

* **Mutations**:
    * `sendRecognition(input: RecognitionInput!)`: Creates a new recognition.
    * `deleteRecognition(id: ID!)`: Deletes a recognition.
    * `updateProfile(...)`: Allows users to update their own profile.

* **Subscriptions**:
    * `onRecognitionReceived(userId: ID!)`: Sends a real-time notification when a user receives a recognition.
    * `onTeamRecognitionUpdate(teamId: ID!)`: Provides live updates for a team's recognition activity.

---

## 🛡️ Security & Architecture

* **Authorization**: A dedicated `AuthMiddleware` module protects every resolver. It checks the user's role and relationship to the data being requested to prevent unauthorized access.
* **Modularity**: Services like `SlackService` and `AnalyticsService` are self-contained, making it easy to add new features or integrations without affecting the core API.
* **Data Handling**: The API uses an in-memory `dummyData` set for demonstration. This can be swapped with a persistent database by updating the data-sourcing logic in the resolvers.

---

