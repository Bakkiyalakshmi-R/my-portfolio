// Single source of truth for portfolio facts. Everything here comes from the resume
// or the Figma copy; do not add achievements that are not in the resume.

export const profile = {
  name: 'Bakkiyalakshmi R.',
  email: 'bakkiyalakshmibsc.cs2425@gmail.com',
  location: 'Kanchipuram, Tamil Nadu, India',
  linkedin: 'https://www.linkedin.com/in/bakkiyalakshmi-r-696166291',
  linkedinLabel: 'linkedin.com/in/bakkiyalakshmi-r-696166291',
  github: 'https://github.com/Bakkiyalakshmi-R',
  githubLabel: 'github.com/Bakkiyalakshmi-R',
}

export const resume = {
  href: '/assets/Bakkiyalakshmi_Resume.pdf',
  downloadName: 'Bakkiyalakshmi_R_Resume.pdf',
}

export type SceneNav = { id: string; n: string; label: string }

export const scenes: SceneNav[] = [
  { id: 'world', n: '01', label: 'World' },
  { id: 'identity', n: '02', label: 'Identity' },
  { id: 'knowledge', n: '03', label: 'Knowledge' },
  { id: 'technology', n: '04', label: 'Technology' },
  { id: 'experience', n: '05', label: 'Experience' },
  { id: 'exhibition', n: '06', label: 'Exhibition' },
  { id: 'milestones', n: '07', label: 'Milestones' },
  { id: 'connect', n: '08', label: 'Connect' },
]

export type SkillView = {
  label: string
  title: string
  group: 'languages' | 'database' | 'ai' | 'web'
  language: 'python' | 'java' | 'cpp' | 'sql' | 'web' | 'git'
  code: string
  footer: string
  note: string
}

export const skillViews: SkillView[] = [
  {
    label: 'Python',
    title: 'Python: Data Modeling & Computation',
    group: 'languages',
    language: 'python',
    code: `# Random Forest classification (illustrative)
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("energy_consumption.csv")
model = RandomForestClassifier(n_estimators=100,
                               random_state=42)
model.fit(X_train, y_train)`,
    footer: 'LANGUAGE: Python',
    note: 'Example: a Random Forest classification workflow, similar to the approach used in WattGuard AI.',
  },
  {
    label: 'Java',
    title: 'Java: Core Syntax',
    group: 'languages',
    language: 'java',
    code: `// Illustrative snippet
public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 5; i++) {
            total += i;
        }
        System.out.println("Total: " + total);
    }
}`,
    footer: 'LANGUAGE: Java',
    note: 'Example: a simple loop in Java.',
  },
  {
    label: 'C++',
    title: 'C++: Core Syntax',
    group: 'languages',
    language: 'cpp',
    code: `// Illustrative snippet
#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int i = 1; i <= 5; i++) total += i;
    cout << "Total: " << total << endl;
    return 0;
}`,
    footer: 'LANGUAGE: C++',
    note: 'Example: a simple loop in C++.',
  },
  {
    label: 'SQL & MySQL',
    title: 'SQL & MySQL: Querying Data',
    group: 'database',
    language: 'sql',
    code: `-- Illustrative query
SELECT category, COUNT(*) AS total
FROM activities
WHERE completed = 1
GROUP BY category
ORDER BY total DESC;`,
    footer: 'DATABASE: MySQL',
    note: 'Example: filtering, grouping and sorting data with SQL.',
  },
  {
    label: 'Machine Learning (Basics)',
    title: 'Machine Learning (Basics): Training a Model',
    group: 'ai',
    language: 'python',
    code: `# Illustrative workflow
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
model.fit(X_train, y_train)
print(model.score(X_test, y_test))`,
    footer: 'FOCUS: Machine Learning fundamentals',
    note: 'Example: splitting data into training and test sets.',
  },
  {
    label: 'HTML, CSS, JavaScript',
    title: 'HTML, CSS, JavaScript: Interactive Interfaces',
    group: 'web',
    language: 'web',
    code: `// Illustrative: persist data with LocalStorage
const items = JSON.parse(localStorage.getItem("items")) || [];
items.push({ title: "New activity", done: false });
localStorage.setItem("items", JSON.stringify(items));`,
    footer: 'WEB: HTML / CSS / JavaScript',
    note: 'Example: saving data with LocalStorage, as in Student Activity Tracker..',
  },
  {
    label: 'Git & GitHub',
    title: 'Git & GitHub: Version Control',
    group: 'web',
    language: 'git',
    code: `# Illustrative workflow
git add .
git commit -m "Add progress tracking"
git push origin main`,
    footer: 'TOOLS: Git, GitHub',
    note: 'Example: committing and pushing changes with Git.',
  },
]

export const skillGroups = [
  { id: 'languages', title: 'Programming Languages', tone: 'forest' },
  { id: 'database', title: 'Database Structures', tone: 'plum' },
  { id: 'ai', title: 'Intelligence & Data Science', tone: 'terracotta' },
  { id: 'web', title: 'Web Dev & Version Architecture', tone: 'ink' },
] as const

export const internshipTools = [
  {
    kicker: 'Vulnerability Scanner',
    name: 'Rapid7 InsightVM',
    description: 'Used for vulnerability assessment during the internship.',
    tone: 'terracotta',
    icon: 'radar',
  },
  {
    kicker: 'SIEM & XDR',
    name: 'Wazuh',
    description: 'Used for endpoint monitoring during the internship.',
    tone: 'forest',
    icon: 'shield',
  },
  {
    kicker: 'Dynamic App Security',
    name: 'OWASP ZAP',
    description: 'Used for web application security testing during the internship.',
    tone: 'plum',
    icon: 'bug_report',
  },
] as const

export type Project = {
  slug: string
  index: string
  kicker: string
  title: string
  tone: 'terracotta' | 'forest'
  overview: string
  description: string
  features: string[]
  tech: string[]
  highlightTech: string
  repo: string
  /** Real screenshot at public/assets/images/<file>. Leave undefined until you add one. */
  screenshot?: string
  demo?: string
}

export const projects: Project[] = [
  {
    slug: 'wattguard-ai',
    index: '01',
    kicker: 'Installation 01 // Machine Learning',
    title: 'WattGuard AI',
    tone: 'terracotta',
    overview:
      'An AI-powered electricity consumption analysis application using machine learning to understand energy usage patterns.',
    description:
      'WattGuard AI – Behavioural Nudging for Sustainable Household Electricity Consumption. An AI-powered system to analyse household electricity consumption and detect inefficient usage patterns.',
    features: [
      'Random Forest machine learning model',
      'Classification of energy usage into Normal, Moderately Inefficient and Highly Inefficient categories',
      'Flask-based API',
      'Interactive dashboard using Chart.js',
      'Energy trend visualizations',
      'Personalized energy-saving recommendations',
    ],
    tech: ['Python', 'Flask', 'Random Forest', 'Chart.js'],
    highlightTech: 'Random Forest',
    repo: 'https://github.com/Bakkiyalakshmi-R/WattGuard-AI',
  },
  {
    slug: 'student-activity-tracker',
    index: '02',
    kicker: 'Installation 02 // Web Application',
    title: 'Student Activity Tracker',
    tone: 'forest',
    overview:
      'A browser-based application designed to manage, categorize, and track student activities with responsive persistence.',
    description:
      'A browser-based student activity tracking web application built with HTML, CSS and JavaScript.',
    features: [
      'Add, edit and delete activities',
      'Completion tracking',
      'Filtering',
      'Drag-and-drop sorting',
      'Real-time progress updates',
      'LocalStorage for offline data persistence',
      'Instant UI updates without page reload',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
    highlightTech: 'LocalStorage',
    repo: 'https://github.com/Bakkiyalakshmi-R/Student-Activity-Tracker',
  },
]

export type Milestone = {
  tone: 'plum' | 'terracotta' | 'forest'
  icon: string
  badge: string
  context: string
  aside: string
  title: string
  body: string
  footIcon: string
  foot: string
  inProgress?: boolean
}

export const milestones: Milestone[] = [
  {
    tone: 'plum',
    icon: 'military_tech',
    badge: 'Silver Badge (75%)',
    context: 'NPTEL',
    aside: 'Score: 75%',
    title: 'Python Programming – NPTEL',
    body: 'Completed the NPTEL Python Programming course with a score of 75%, earning the Silver Badge.',
    footIcon: 'check_circle',
    foot: 'Completed Certification',
  },
  {
    tone: 'terracotta',
    icon: 'psychology',
    badge: 'Bootcamp · In Progress',
    context: 'Udemy',
    aside: 'Status: In Progress',
    title: 'Python for Machine Learning & Data Science Bootcamp',
    body: 'Udemy bootcamp on Python for Machine Learning and Data Science. Currently in progress.',
    footIcon: 'pending',
    foot: 'In Progress — not yet completed',
    inProgress: true,
  },
  {
    tone: 'forest',
    icon: 'design_services',
    badge: 'Web Designing',
    context: 'SSKV College',
    aside: 'SSKV College of Arts and Science for Women',
    title: 'Web Designing Certification',
    body: 'Web Designing Certification from SSKV College of Arts and Science for Women.',
    footIcon: 'palette',
    foot: 'Web Designing',
  },
]
