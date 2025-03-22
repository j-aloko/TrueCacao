# Smart Variants Selection with Next.js

This project demonstrates a **Smart Variants Selection** feature built with **Next.js** and **Redux Toolkit**. It allows users to dynamically select product variants (e.g., packaging types, weights, sizes, colors) while ensuring that only valid combinations are available. The feature is designed to be reusable and configurable for different types of products and variant properties.

## Features

- **Dynamic Variant Selection**:

  - Users can select product variants (e.g., packaging types, weights) from a list of options.
  - Unavailable combinations are **disabled but visible**, ensuring a seamless user experience.

- **Reusable and Configurable**:

  - The `ProductDetailsContainer` component is designed to handle any type of variant properties (e.g., `packaging.type`, `weight`, `size`, `color`).
  - Variant properties and labels are passed as props, making the component highly reusable.

- **State Management with Redux Toolkit**:

  - The app uses **Redux Toolkit** to manage the state of selected variants, available options, and quantities.
  - State persistence is handled using **Redux Persist** with **cookie storage**, ensuring that user selections are saved across page refreshes and sessions.

- **Responsive UI**:
  - Built with **Material-UI (MUI)** for a clean and responsive user interface.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repo
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## Usage

### Configuring Variant Properties

The `ProductDetailsContainer` component is designed to handle any type of variant properties. To configure it:

1. Define the variant properties and labels in the parent component (e.g., `page.js`):

   ```javascript
   const variantProps = ['packaging.type', 'weight']; // Dynamic variant properties
   const labels = {
     packaging: 'Packaging',
     weight: 'Weight',
   };
   ```

2. Pass the `variantProps` and `labels` to the `ProductDetailsContainer`:

   ```javascript
   <ProductDetailsContainer
     product={product}
     variantProps={variantProps}
     labels={labels}
   />
   ```

### Example Product Data

The `product` object should include a list of variants with the specified properties:

```javascript
const product = {
  id: 'product-1',
  name: 'Raw Cocoa Powder',
  variants: [
    {
      id: 'variant-1',
      packaging: { type: 'SACHET' },
      weight: 100,
      price: 5.99,
      stock: 50,
    },
    {
      id: 'variant-2',
      packaging: { type: 'CARTON_OF_SACHETS' },
      weight: 100,
      price: 30.99,
      stock: 30,
    },
    // Add more variants...
  ],
};
```

---

## How It Works

### Smart Variant Selection Logic

1. **Initialization**:

   - On component mount, the app extracts all unique values for each variant property and sets the default variant.

2. **Dynamic Filtering**:

   - When a user selects a variant property (e.g., `packaging.type`), the app filters the product variants to find valid combinations.
   - Unavailable options are **disabled but remain visible**.

3. **State Persistence**:

   - User selections are saved to **cookies** using **Redux Persist**, ensuring that selections persist across page refreshes and sessions.

4. **UI Updates**:
   - The UI dynamically updates to reflect the available options based on the user's selections.

---

## Folder Structure

```
src/
  app/
    components/
      counter-field/          # Counter component for quantity selection
      render-product-buttons/ # Buttons for "Add to Cart" and "Buy Now"
      text-block/             # Reusable text component
    containers/
      product-details-container/ # Main container for variant selection
    services/
      redux/
        features/
          product-selection/  # Redux slice for variant selection state
        store.js              # Redux store configuration
    page.js                   # Main page with product data and configuration
```

---

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Redux Toolkit**: State management library for managing application state.
- **Redux Persist**: Library for persisting Redux state to **cookies**.
- **Material-UI (MUI)**: Component library for building responsive and accessible UIs.

---

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
