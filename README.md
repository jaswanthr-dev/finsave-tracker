# FinSave - Financial Intelligence Dashboard

FinSave is a high-performance financial tracking application designed for real-time budget management, expense categorization, and data-driven insights.

[🚀 View Live Demo](https://finsave-tracker.vercel.app)

## 🚀 Quick Overview
| Metric | Detail |
| :--- | :--- |
| **Project Name** | FinSave |
| **Primary Goal** | Streamlined Financial Tracking |
| **Tech Stack** | Next.js 15, Tailwind, Recharts |
| **Status** | Active Development |

---

## 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router for optimized performance)
* **Visualization:** Recharts (Chosen for modularity and responsive SVG rendering)
* **Styling:** Tailwind CSS (Utility-first approach for design consistency)
* **Persistence:** Local Storage API (Client-side state management for zero-latency)
* **Deployment:** Vercel (Optimized for CI/CD and edge caching)

## 🏗 Key Features
* **Real-time Analytics:** Track balances, income, and expenses with instantaneous updates.
* **Interactive Visualization:** Responsive bar graphs for data-driven insights.
* **Client-Side Persistence:** Secure, zero-latency data access via local storage.
* **Responsive Design:** Mobile-first architecture ensuring usability on all screen sizes.

## 🧠 Architectural Decisions
* **Performance:** Leveraged the Next.js App Router to reduce initial load time and optimize rendering.
* **Efficiency:** Used Recharts because it integrates seamlessly with React state, reducing the need for heavy, external data visualization libraries.

---

## 📁 Project Structure

finsave-tracker/
├── src/
│   ├── app/           # Next.js routes
│   ├── components/    # Recharts & UI components
│   └── public/        # Assets
├── package.json
└── README.md

## 🛣 Future Roadmap
- [ ] Implement Authentication (NextAuth.js) for user-specific data.
- [ ] Add CSV export functionality for financial reporting.
- [ ] Integration with Plaid/Stripe APIs for automated bank syncing.

## ⚡ Getting Started
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/jaswanthr-dev/finsave-tracker.git](https://github.com/jaswanthr-dev/finsave-tracker.git)
