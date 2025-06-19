# 📝 Team Journal Web Application

A full-stack web app for personal journaling within a team environment. Each user can securely register, log in, and manage their **private journal entries**—including optional image attachments.

---

## 🎯 Objective

Many teams lack a structured and **private space** for individuals to log their work, reflect on progress, or document personal insights. Traditional tools are either public or task-based. This app fills that gap with a **secure digital journal** tailored for individual use within a team context.

---

## 🔧 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) with:
  - **App Router**
  - **Server Components**
  - **Server Actions**
- **SCSS** for styling
- **React Context** for session management

### Backend
- [Supabase](https://supabase.com/)
  - **Authentication (Email/Password)**
  - **Storage (for image uploads)**
  - **PostgreSQL Database** with **Row-Level Security (RLS)**

### Deployment
- [Vercel](https://vercel.com/) (for seamless Next.js hosting)

---

## ✨ Features

- 🔐 User Registration & Login (Supabase Auth)
- 📓 Create, Edit, Delete, and View **personal journal entries**
- 🖼️ Optional image upload per entry (stored in Supabase Storage)
- 🔒 **Private data** access enforced via Supabase RLS
- 🌐 Deployed on Vercel with public GitHub repo

---

## 🗃️ Supabase Setup

1. **Create a Supabase Project**
2. **Enable Email/Password Auth**
3. **Create a table** named `entries`:
   ```sql
   create table public.entries (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     title text not null,
     content text,
     image_url text,
     created_at timestamp with time zone default now()
   );
   ```

4. **Enable RLS** and apply this policy:

   ```sql
   alter table public.entries enable row level security;

   create policy "Users can access their own entries"
   on entries for all
   using (auth.uid() = user_id);
   ```
5. **Create a storage bucket** named `journal-images`.

---

## 🚀 Deployment

1. Push code to a **public GitHub repo**
2. Deploy to **Vercel**
3. Set environment variables:

   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY`

---

## ✅ Evaluation Criteria

* Correct use of Next.js App Router, Server Components, and Server Actions
* Secure and clean Supabase integration (Auth, Storage, RLS)
* Functional and clean UI with SCSS
* Modular codebase & commit history
* Deployed and working demo

---

## 💡 Bonus Features (Optional)

* 🧾 Markdown support for journal content
* 📱 Mobile responsive layout
* ⚠️ Error handling and form validation

---

## 📎 Links

* 🔗 [Live Demo](https://your-vercel-app.vercel.app)
* 📂 [GitHub Repository](https://github.com/yourusername/team-journal)

---

## 📄 License

MIT License. Free to use and modify. 