# How to View Your Website on Any Device

You can view your website on other platforms (phones, tablets, other laptops) in two ways.

---

## Option 1: Publish to the Internet (Recommended)
**Use this if you want to share the link with friends or view it anywhere.**

We will use **Netlify Drop** (free, no account required initially).

### **Step 1: Locate Your Build Folder**
1. Open your computer's **Finder** (file explorer).
2. Go to your project folder: `/Users/manomay/anti gravity projects`
3. Find the folder named **`dist`**.
   *(This folder was created when we ran the build command. It contains your complete, ready-to-go website).*

### **Step 2: Drag & Drop**
1. Open your web browser and go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the **`dist`** folder from your Finder and drop it into the box on the webpage that says "Drag and drop your site folder here".
3. Wait a few seconds for it to upload.

### **Step 3: Go Live!**
1. Netlify will generate a random link for you (e.g., `silly-panda-123456.netlify.app`).
2. **Click that link** on your computer to test it.
3. **Send that link** to your phone or type it into your phone's browser.
4. You can now see your "Elegant Fine Dining" site on any device in the world!

---

## Option 2: Local Network Preview (Quick Test)
**Use this if you just want to quickly test on your phone while connected to the same Wi-Fi.**

1. Open your **Terminal** (where you run commands).
2. Make sure you are in your project folder.
3. Run this command:
   ```bash
   npm run dev -- --host
   ```
4. Look at the output. It will show a "Network" URL, like:
   ```
   > Network:  http://192.168.1.5:5173/
   ```
5. Type that exact URL (numbers and all) into your **phone's web browser**.
6. *Note: Your phone must be on the same Wi-Fi network as your laptop.*

---

## Troubleshooting
- **404 Errors?** Make sure you dragged the `dist` folder, NOT the whole project folder.
- **Can't connect on phone?** Check that your laptop firewall isn't blocking connections (for Option 2), or just use Option 1 (Deployment) which is more reliable.
