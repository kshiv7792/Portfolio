# Shiv Kumar Paswan — Interactive AI Portfolio

3 files, koi build step nahi — pure HTML/CSS/JS. Seedha Vercel pe deploy ho jayega.

## Kya kya interactive hai
- **Boot screen** — page load pe ek "initializing..." animation
- **Neural network background** — canvas pe animated nodes/lines jo mouse ke paas react karte hain
- **Custom cursor** — desktop pe glowing ring cursor, links/buttons pe hover karne se badhta hai
- **Terminal hero** — typewriter effect me commands type hoke output dikhate hain, loop me
- **"Ask about me"** — ek chota scripted chat widget, chip pe click karo aur AI-style typed answer milta hai (poori tarah client-side, koi backend/API nahi)
- **Skill constellation** — hover/tap se skill category ka detail dikhta hai, connected line highlight hoti hai
- **Scroll-animated timeline** — line progressively fill hoti hai jaise scroll karte ho
- **Filterable project grid** — category chips se filter, aur har card expand hoke extra detail dikhata hai
- **Magnetic buttons**, **scroll progress bar**, **copy-to-clipboard contact buttons**
- Sab kuch `prefers-reduced-motion` respect karta hai — jinko motion pasand nahi unke liye animations off ho jaati hain

## Files
- `index.html` — structure/content
- `styles.css` — sab styling
- `script.js` — sab interactivity

## Local pe dekhna
`index.html` ko seedha browser me kholo — kaam karega. (Best experience ke liye ek local server se chalao, kyunki kuch browsers file:// se fetch pe thoda strict hote hain — ye site koi external fetch use nahi karti toh normally seedha bhi chal jayega.)

## Vercel pe deploy karna

### Option A — CLI se (fastest)
Is folder ke andar terminal khol ke:
```bash
npm install -g vercel
vercel login
vercel
```
Sawaal aayenge, sab default (Enter) daboke aage badho. Live URL mil jayegi.
Update karne ke baad: `vercel --prod`

### Option B — Website se
1. [vercel.com](https://vercel.com) pe GitHub se login karo.
2. Is folder ko ek GitHub repo me push karo.
3. Vercel dashboard → "Add New Project" → repo import karo → Framework "Other" rakho → Deploy.
4. Ab har naye push pe auto-deploy hoga.

## Customize karna
- **Colors/fonts** — `styles.css` ke top pe `:root { ... }` me saare CSS variables hain.
- **Terminal lines** — `script.js` me `termLines` array edit karo.
- **Ask-AI answers** — `script.js` me `QA` array edit karo (naye sawaal-jawab add/remove kar sakte ho).
- **Skills** — `script.js` me `skillData` array edit karo.
- **GitHub link** — `index.html` me "GitHub ↗" wale `<a href="...">` me apna asli profile URL daal dena.
- **Projects** — `index.html` me har `.proj-card` ke andar text, `data-tags` (filter ke liye) aur `.proj-more` (expand wala extra text) edit kar sakte ho.

Kuch bhi tweak karna ho ya naya interactive section chahiye ho toh bata dena.
