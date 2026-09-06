# 🏭 MPC/SRC WAREHOUSE - Product Catalog

A minimalist, high-performance web catalog built specifically for **MPC/SRC WAREHOUSE**. Designed for the cleanest client experience without clutter: clients can search, filter by category dropdown, view photo slideshows, and send direct WhatsApp orders containing strictly the product reference, designation, and quantity.

---

## ⚡ Quick Start

This project requires **no server setup, no Node.js, and no database**. It runs directly in any modern browser:

1. Open **`index.html`** in your browser.
2. Browse products, search, or filter by category.
3. Click any product to open the dedicated **`product.html`** page.
4. Click **Send Order on WhatsApp** — the message will strictly send:
   ```text
   REF: [Ref]
   Designation: [Designation]
   Qte: [Qte]
   ```

---

## 🔒 Admin Panel Access

The management interface is on a **dedicated page (not a modal)**:

1. Click **Admin Login** in the top right of the header (or go to `admin-login.html`).
2. Enter the password:
   - **Default Password**: `admin123`
3. Once logged in, you enter `admin.html`:
   - **Quick Stock Qte Editor**: Type new stock quantities directly in the table to update instantly.
   - **Add New Product**: Add items with multiple photo URLs (for image sliders), Ref, Designation, and Qte.
   - **Edit / Delete**: Modify or remove any product.
   - **Settings**: Change warehouse WhatsApp number, phone number, or update the Admin password.
   - **Export / Import JSON**: Backup and restore your inventory anytime.
   - **Logout**: Clears your session securely.

---

## 📁 File Structure

```
warehouse-catalog/
├── index.html          # Main catalog: Single black header, search, category dropdown + grid
├── product.html        # Dedicated product detail page (slideshow, specs, Call & WhatsApp)
├── admin-login.html    # Secure admin password login page
├── admin.html          # Dedicated full-page Admin management dashboard
├── css/
│   └── style.css       # Clean, minimalist styling & photo slider controls
├── js/
│   ├── data.js         # Default catalog & MPC/SRC warehouse settings
│   └── app.js          # Shared state, catalog logic, auth & strict WhatsApp format
└── README.md           # Documentation
```
