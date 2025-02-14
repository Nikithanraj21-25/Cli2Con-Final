# 📱 ScannerRN - QR Code Scanner & Generator

**ScannerRN** is a React Native application that **automatically generates a QR Code** using the user's contact information after permission is granted. The app also supports **scanning QR codes** and **business card extraction**.

---

## ✨ Features

✅ **Automatic QR Code Generation**  
   - Fetches user details from the Contacts app after permission is granted.  
   - Generates a QR Code automatically with name, phone, email, etc.  

✅ **QR Code Scanner**  
   - Scans QR codes and displays extracted data.  

✅ **Business Card Scanner**  
   - Multiple Cards Detected → Automatically saves all contacts.  
   - Single Card Detected → Opens contact form with prefilled details for review.  

---

## 🚀 Installation Guide

1️⃣ Clone the Repository
git clone https://github.com/Nikithanraj21-25/Cli2Con-Final.git
cd scannerrn

2️⃣ Install Dependencies
npm install

3️⃣ Link Dependencies (If using React Native CLI)
For React Native versions below 0.60, run:
react-native link

For versions 0.60+, auto-linking takes care of this.

📲 Running the Project
For Android
Make sure your emulator or device is connected, then run:

npx react-native run-android

## 🎯 How to Use
📌 Automatic QR Code Generation
1. When you first install and open the app, it requests permission to access contacts.
2. If allowed, the app automatically retrieves your contact details (Name, Phone, Email).
3. It then generates a QR Code containing this information.
4. You can scan this QR code to share your details instantly.

📌 QR Code Scanner
1. Open the app and navigate to the QR Scanner.
2. Point the camera at a QR code.
3. The scanned data will be displayed in your contact form.

📌 Business Card Scanner
1. Take a picture of a business card.
2. The app extracts name, phone, email, and address.
3. If multiple business cards are detected → Contacts are automatically saved.
4. If a single card is detected → The contact form opens with prefilled details for review and saving.

## ⚡ Dependencies Used

- **react-native-qrcode-scanner** - Scans QR codes
- **react-native-qrcode-svg** - Generates QR codes
- **react-native-contacts** - Fetches user contact details
- **react-native-permissions** - Manages contact access permissions
- **react-native-camera** - Accesses the camera for scanning
- **react-native-image-picker** - Captures images for business card scanning
- **axios** - Handles API requests
- **react-navigation** - Manages screen navigation

## 🔐 Permissions Required

READ_CONTACTS - Retrieves user contact details for QR Code generation
WRITE_CONTACTS	- Saves extracted business card data to the phone
CAMERA - Scans QR codes & business cards

## 🛠️ API Integration
The app communicates with an Express.js backend to process images and extract business card details using OpenAI Vision API.

Backend Repository: [[Backend Repo URL Here](https://github.com/Nikithanraj21-25/backend)]

## 🤝 Contributing
Want to contribute? Follow these steps:

Fork the repository
Create a branch (git checkout -b feature-branch)
Commit your changes (git commit -m "Added a new feature")
Push to GitHub (git push origin feature-branch)
Open a Pull Request 🎉
🔒 License
This project is licensed under the MIT License.
