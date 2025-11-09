import { HeroData, AboutData, EducationItem, SkillCategory, ExperienceItem, Certificate, Activity, ContactData, ThemeColors, MenuItem, BlogPost, EventItem, ProjectItem } from './types';

// --- INITIAL DATA (to seed localStorage if empty) ---
const initialHeroData: HeroData = {
  name: "Nishan Rahman",
  profilePhoto: "https://i.ibb.co/6yvGMZ5/Nishan-Rahman.jpg",
  tagline: "Data Analyst | Tech Explorer | AI Agent Development",
  socialLinks: [
    { id: '1', name: 'LinkedIn', url: '#' },
    { id: '2', name: 'Twitter', url: '#' },
    { id: '3', name: 'Facebook', url: '#' },
    { id: '4', name: 'Instagram', url: '#' },
    { id: '5', name: 'GitHub', url: '#' },
  ]
};
const initialAboutData: AboutData = {
  content: "I'm a Management Studies student at the University of Rajshahi with strong skills in Data Analytics, Visualization, and AI tools. Passionate about solving business problems with data-driven solutions and modern productivity tools."
};
const initialEducationData: EducationItem[] = [
    { id: '1', institution: 'University of Rajshahi', degree: 'BBA in Management Studies', duration: 'September 2023 - Present', logo: 'https://i.ibb.co/sW2nJcZ/RU-logo.png', campusImage: 'https://i.ibb.co/3YYsK61/RU-Campus.jpg', link: '#' },
    { id: '2', institution: 'A.B.C.D College', degree: 'Higher Secondary Certificate', duration: '2020-2022', logo: 'https://i.ibb.co/hZKM2LV/ABCD-College-Logo.png', campusImage: 'https://i.ibb.co/dDq0sR2/ABCD-College-Campus.jpg', link: '#' },
    { id: '3', institution: 'Shishutala Asim Kumar Secondary School', degree: 'Secondary School Certificate', duration: '2018-2020', logo: 'https://i.ibb.co/hZKM2LV/ABCD-College-Logo.png', campusImage: 'https://i.ibb.co/dDq0sR2/ABCD-College-Campus.jpg', link: '#' },
];
const initialCertificates: Certificate[] = [
    { id: '1', title: "Google Data Analytics", issuer: 'Google', image: 'https://i.ibb.co/yQj9mJd/Google-Data-Analytics.png', link: '#' },
    { id: '2', title: "Technical Support Fundamentals", issuer: 'Google', image: 'https://i.ibb.co/yQj9mJd/Google-Data-Analytics.png', link: '#' },
    { id: '3', title: "Mastering Supervision", issuer: 'Alison', image: 'https://i.ibb.co/yQj9mJd/Google-Data-Analytics.png', link: '#' },
]
const initialSkillData: SkillCategory[] = [
    { id: '1', title: "Data Analytics & Visualization", iconName: 'DataAnalytics', skills: [{id: 's1', name: 'Excel'}, {id: 's2', name: 'Google Sheets'}, {id: 's3', name: 'Tableau'}, {id: 's4', name: 'Power BI'}, {id: 's5', name: 'R'}, {id: 's6', name: 'Python'}, {id: 's7', name: 'SQL'}] },
    { id: '2', title: "Productivity Tools", iconName: 'ProductivityTools', skills: [{id: 's8', name: 'Microsoft 365'}, {id: 's9', name: 'Google Docs'}, {id: 's10', name: 'Zoom'}] },
    { id: '3', title: "Design Tools", iconName: 'DesignTools', skills: [{id: 's11', name: 'Canva'}, {id: 's12', name: 'Photoshop'}, {id: 's13', name: 'Illustrator'}] },
    { id: '4', title: "Website Developer", iconName: 'WebsiteDeveloper', skills: [{id: 's14', name: 'HTML'}, {id: 's15', name: 'CSS'}, {id: 's16', name: 'Java Script'}, {id: 's17', name: 'GitHub'}, {id: 's18', name: 'Wordpress'}] },
    { id: '5', title: "Video Editing", iconName: 'VideoEditing', skills: [{id: 's19', name: 'AfterEffects'}, {id: 's20', name: 'Kinemaster'}, {id: 's21', name: 'CapCut'}] },
]
const initialExperience: ExperienceItem[] = [
    { id: '1', title: "Content Writer", company: "USA-based Company", duration: "3 months (May-July 2024)", iconName: 'ContentWriter', description: "Created engaging content for various digital platforms" },
    { id: '2', title: "Google Data Analytics Projects", company: "Self-paced Learning", duration: "50+ hands-on projects", iconName: 'Projects', description: "Google Sheets, Tableau, BigQuery, R Programming" },
    { id: '3', title: "Google Data Analytics Capstone", company: "Google Certificate Program", duration: "Completed Case Study", iconName: 'Capstone', description: "End-to-end data analysis project demonstrating full data analytics lifecycle" },
]
const initialActivities: Activity[] = [
    { id: '1', title: "Chief of IT and Administration", organization: "Hult Prize RU 2025 - 2026", duration: "", iconName: 'Extracurricular' },
    { id: '2', title: "Deputy Director of Documentation", organization: "Rajshahi University Career Club", duration: "", iconName: 'Extracurricular' },
    { id: '3', title: "Volunteer", organization: "Hult Prize RU 2024-25", duration: "", iconName: 'Extracurricular' },
];
const initialProjectsData: ProjectItem[] = [];
const initialBlogData: BlogPost[] = [
    { id: '1', title: 'My First Blog Post', content: 'This is the content of my first blog post. It talks about technology and data.', isPublished: true, images: ['https://i.ibb.co/yQj9mJd/Google-Data-Analytics.png'], videos: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'] }
];
const initialEventsData: EventItem[] = [
    { id: '1', title: 'Hult Prize OnCampus Launch', description: 'Launched the Hult Prize competition at Rajshahi University, kicking off a season of innovation and social entrepreneurship.', caption: 'Team Hult Prize RU 2025', order: 1, images: ['https://i.ibb.co/3YYsK61/RU-Campus.jpg', 'https://i.ibb.co/dDq0sR2/ABCD-College-Campus.jpg'] }
];
const initialContact: ContactData = {
    phone: "+880 1601944455",
    email: "mdnishanrahman0@gmail.com",
    description: "Feel free to reach out for collaborations, opportunities, or just to connect. I'm always open to discussing data analytics, AI, and innovative solutions."
}
const initialThemeData: ThemeColors = {
  primary: '#664dff',
  secondary: '#3b71de',
  accent: '#a363f2',
  bgStart: '#f3f0ff',
  bgMid: '#eef5ff',
  bgEnd: '#f8f0ff',
};
const initialMenuItems: MenuItem[] = [
  { id: '1', label: 'Home', link: '#/', isRoute: true, order: 1 },
  { id: '2', label: 'About', link: '#about', isRoute: false, order: 2 },
  { id: '11', label: 'Projects', link: '#/projects', isRoute: true, order: 3 },
  { id: '6', label: 'Experience', link: '#/experience', isRoute: true, order: 4 },
  { id: '3', label: 'Education', link: '#/education', isRoute: true, order: 5 },
  { id: '4', label: 'Certificates', link: '#/certificates', isRoute: true, order: 6 },
  { id: '5', label: 'Skills', link: '#/skills', isRoute: true, order: 7 },
  { id: '7', label: 'Activities', link: '#/activities', isRoute: true, order: 8 },
  { id: '9', label: 'Blog', link: '#/blog', isRoute: true, order: 9 },
  { id: '10', label: 'Events', link: '#/events', isRoute: true, order: 10 },
  { id: '8', label: 'Contact', link: '#contact', isRoute: false, order: 11 },
];


// --- MOCK API using localStorage ---
// This simulates an async API call, like you'd have with a real backend.
const apiDelay = 50; 

const getItem = <T,>(key: string, defaultValue: T): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const storedValue = localStorage.getItem(key);
                if (storedValue) {
                    resolve(JSON.parse(storedValue));
                } else {
                    localStorage.setItem(key, JSON.stringify(defaultValue));
                    resolve(defaultValue);
                }
            } catch (error) {
                console.error(`Error getting item "${key}" from localStorage:`, error);
                resolve(defaultValue);
            }
        }, apiDelay);
    });
};

const setItem = <T,>(key: string, value: T): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(`Error setting item "${key}" in localStorage:`, error);
            }
            resolve();
        }, apiDelay);
    });
};

// --- API Functions for each section ---

export const getHeroData = () => getItem<HeroData>('portfolio-hero', initialHeroData);
export const saveHeroData = (data: HeroData) => setItem('portfolio-hero', data);

export const getAboutData = () => getItem<AboutData>('portfolio-about', initialAboutData);
export const saveAboutData = (data: AboutData) => setItem('portfolio-about', data);

export const getEducationData = () => getItem<EducationItem[]>('portfolio-education', initialEducationData);
export const saveEducationData = (data: EducationItem[]) => setItem('portfolio-education', data);

export const getCertificates = () => getItem<Certificate[]>('portfolio-certificates', initialCertificates);
export const saveCertificates = (data: Certificate[]) => setItem('portfolio-certificates', data);

export const getSkillData = () => getItem<SkillCategory[]>('portfolio-skills', initialSkillData);
export const saveSkillData = (data: SkillCategory[]) => setItem('portfolio-skills', data);

export const getExperience = () => getItem<ExperienceItem[]>('portfolio-experience', initialExperience);
export const saveExperience = (data: ExperienceItem[]) => setItem('portfolio-experience', data);

export const getActivities = () => getItem<Activity[]>('portfolio-activities', initialActivities);
export const saveActivities = (data: Activity[]) => setItem('portfolio-activities', data);

export const getProjects = () => getItem<ProjectItem[]>('portfolio-projects', initialProjectsData);
export const saveProjects = (data: ProjectItem[]) => setItem('portfolio-projects', data);

export const getBlogPosts = () => getItem<BlogPost[]>('portfolio-blog', initialBlogData);
export const saveBlogPosts = (data: BlogPost[]) => setItem('portfolio-blog', data);

export const getEvents = () => getItem<EventItem[]>('portfolio-events', initialEventsData);
export const saveEvents = (data: EventItem[]) => setItem('portfolio-events', data);

export const getContact = () => getItem<ContactData>('portfolio-contact', initialContact);
export const saveContact = (data: ContactData) => setItem('portfolio-contact', data);

export const getTheme = () => getItem<ThemeColors>('portfolio-theme', initialThemeData);
export const saveTheme = (data: ThemeColors) => setItem('portfolio-theme', data);

export const getMenuItems = () => getItem<MenuItem[]>('portfolio-menu', initialMenuItems);
export const saveMenuItems = (data: MenuItem[]) => setItem('portfolio-menu', data);
