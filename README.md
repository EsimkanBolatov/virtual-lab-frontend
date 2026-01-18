virtual-lab/
├── backend/
│   ├── main.py                 ← Backend негізгі файл
│   ├── models.py              ← Database models
│   ├── database.py            ← Database connection
│   ├── requirements.txt       ← Python пакеттер
│   └── virtual_lab.db         ← SQLite база (автоматты құрылады)
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   └── AuthPage.tsx          ← Login/Register компоненті
    │   │   └── experiments/
    │   │       └── HClExperiment.tsx     ← HCl тәжірибе компоненті
    │   ├── App.tsx                       ← Негізгі App
    │   ├── main.tsx                      ← Entry point
    │   └── index.css                     ← Styles
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.js