# Group Expense Splitter

Group Expense Splitter is a web application designed to help groups manage and split expenses efficiently. It allows users to add, edit, and remove expenses, and calculate settlements among group members.

## Features

- **Add Expenses**: Add new expenses with details like category, amount, payer, and split members.
- **Edit Expenses**: Modify existing expenses.
- **Remove Expenses**: Delete expenses from the group.
- **Split Expenses**: Automatically calculate how expenses are shared among group members.
- **Group Management**: Manage group details and members.

## Technologies Used

- **Frontend**: Vue.js 3
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Project Structure

```
index.html
package.json
postcss.config.js
tailwind.config.js
vite.config.js
src/
  App.vue
  main.js
  style.css
  components/
    ConfirmPopup.vue
  router/
    index.js
  stores/
    groupStore.js
  views/
    ExpenseView.vue
    GroupView.vue
    HomeView.vue
    SettlementView.vue
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd group-expense-splitter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Usage

- Navigate to the application in your browser.
- Create or select a group.
- Add expenses and manage them as needed.
- Use the settlement feature to calculate how much each member owes or is owed.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.