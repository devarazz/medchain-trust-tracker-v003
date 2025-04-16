# MedChain - Blockchain-Based Medical Supply Chain System

MedChain is a decentralized, blockchain-powered application designed to ensure transparency, authenticity, and traceability across the pharmaceutical supply chain. The platform features role-based login for each stakeholder involved—from Manufacturer to Consumer.

---

## 🚀 **Features**

### 🔐 Role-Based Access:
- **Manufacturer**: Register and certify medicine batches.
- **Distributor**: Verify and sign batches after validation.
- **Wholesaler**: Double-check and sign after distributor.
- **Retailer**: Final verification before selling to consumers.
- **Consumer**: Verify authenticity of medicines and download certificates.

---

## 🖥️ **User Interface**

The system includes a clean UI with:
- Profile dropdown menu with user info and options (as seen in the image):
  - Username & email
  - Profile
  - Settings
  - Sign out

---

## 🧪 **Tech Stack**
- **Frontend**: React.js / HTML / CSS (TailwindCSS recommended)
- **Backend**: Node.js / Express.js
- **Blockchain**: Ethereum / Hyperledger Fabric
- **Smart Contracts**: Solidity
- **Database**: MongoDB / IPFS for off-chain storage
- **QR Code Generation**: `qrcode` npm library

---

## 📦 **Installation**

```bash
git clone https://github.com/yourusername/medchain.git
cd medchain
npm install
npm start
```

---

## 📸 **Screenshots**

| Profile Menu | Dashboard |
|--------------|-----------|
| ![Profile Dropdown](./screenshots/profile.png) | ![Dashboard](./screenshots/dashboard.png) |

---

## 📄 **License**
This project is open-source under the MIT License.

