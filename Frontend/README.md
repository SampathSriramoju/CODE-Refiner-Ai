# AI Code Refiner (React + Tailwind, zero-install)

This is a modern, dark-themed React frontend for an **AI Code Refiner** app.

## Features
- Large code input textarea
- Language dropdown (Python, JavaScript, Java, C++)
- Mode dropdown (Refine / Explain / Optimize)
- Action button with loading spinner
- Output code block + explanation
- Copy code button
- Empty-input validation + smooth UI transitions
- Mock API integration using `setTimeout`

## Run it

Because Node/npm aren’t required, you can run it with any static server.

### Option A: VS Code / Cursor Live Server extension
- Open `index.html`
- Click **Go Live**

### Option B: Python (if installed)
From this folder:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

### Option C: PowerShell (if you have .NET)

```powershell
dotnet tool install --global dotnet-serve
dotnet serve -p 5173
```

Then open `http://localhost:5173`.

