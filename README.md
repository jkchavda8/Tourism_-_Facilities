# 🗺️ Tourism and Facilities Platform

## 🌍 Overview
**Tourism and Facilities** is an intelligent and user-friendly platform for discovering, contributing, and managing tourist places, hotels, and restaurants. The system empowers users to explore verified locations, contribute new entries, and interact through reviews and chat-based queries. Admins manage the approval process for user-submitted data, ensuring high-quality and reliable content.

---

## 🚀 Features

### 🛡️ Admin Panel
- Approve or block submitted **places**, **hotels**, and **restaurants**.
- Review updated content before displaying it publicly.
- Ensure only verified and quality listings appear on the platform.

### 👤 User Features
- **Authentication:** Sign up / log in to access the platform.
- **Explore Places:** View only admin-approved places, sorted by **rating**.
- **Smart Search:** Search by name, address, price, or description.
- **Category Filter:** Filter places using a select-menu category filter.
- **Contribute:** Upload or update places, hotels, or restaurants (pending admin approval).
- **Manage Contributions:** View your submitted items and their approval status.
- **Place Details Popup:** 
  - See place/hotel/restaurant info in a modal view.
  - View **nearby hotels** (within 5 km).
  - View **nearby restaurants** (within 5 km).
  - Submit and read reviews on a **dedicated review page**.
- **PlaceChatBot:** Ask questions about any place and get intelligent responses.

---

## 🤖 Machine Learning Features
- **ChatBot** – Users can interact with an intelligent assistant for tourist place information.
- **Review System** – Users can view and post reviews that affect the rating and sorting of listings.

---

## 🏗 Tech Stack
- **Frontend:** Angular
- **Backend:** Node.js + Express.js
- **ML Services:** Python + Flask (ChatBot & Review)
- **Database:** MongoDB Atlas

---

## 📦 Installation

### Prerequisites:
- Node.js
- Angular CLI
- Python 
- MongoDB Atlas set up and connected

---

### Steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/jkchavda/tourism_-_facilities.git
   cd tourism_-_facilities

2. **Install & Run Backend:**
    ```bash
    cd server
    npm install
    npm start
    ```
3. **Install & Run Frontend:**
    ```bash
    cd ../client
    npm install
    ng serve
    ```
4. **Run ML Flask APIs:**

ChatBot API:

   ```bash
   cd ../AI_Api/ChatBot
   python app.py
   ```

Review API:

  ```bash
  cd ../AI_Api/reviewApi
  python app.py
  ```
    
## 📝 Usage
1. Register/login as a user.
2. Explore approved places sorted by rating.
3. Use category filters and smart search to refine results.
4. Click on any listing to view detailed info and nearby options.
5. Submit new places, hotels, or restaurants.
6. Add reviews and interact with the chatbot to learn more.
7. Admins can log in to approve or block submissions.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve features or fix bugs.

## 📞 Contact
For queries, reach out to: 
- Email: jay886888@gmail.com
- GitHub: (https://github.com/jkchavda8)
