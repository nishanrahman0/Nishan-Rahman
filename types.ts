export enum Section {
  Hero = 'Hero',
  About = 'About',
  Education = 'Education',
  Certificates = 'Certificates',
  Skills = 'Skills',
  Experience = 'Experience',
  Activities = 'Activities',
  Projects = 'Projects',
  Contact = 'Contact',
  Theme = 'Theme',
  // Below are placeholder sections from original code
  Menu = 'Menu',
  Events = 'Events',
  Blog = 'Blog',
  Ads = 'Ads',
}

export interface SocialLink {
  id: string;
  name: 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram' | 'GitHub';
  url: string;
}

export interface HeroData {
  name: string;
  profilePhoto: string;
  tagline: string;
  socialLinks: SocialLink[];
}

export interface MenuItem {
  id: string;
  label: string;
  link: string;
  isRoute: boolean;
  order: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bgStart: string;
  bgMid: string;
  bgEnd: string;
}

export interface AboutData {
  content: string;
}

export interface EducationItem {
  id:string;
  institution: string;
  degree: string;
  duration: string;
  logo: string;
  campusImage: string;
  link: string;
}

export interface SkillItem {
  id: string;
  name: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: 'DataAnalytics' | 'ProductivityTools' | 'DesignTools' | 'WebsiteDeveloper' | 'VideoEditing';
  skills: SkillItem[];
}


export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  iconName: 'ContentWriter' | 'Projects' | 'Capstone';
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image: string;
  link: string;
}

export interface Activity {
  id: string;
  title: string;
  organization: string;
  duration: string;
  iconName: 'Extracurricular';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  link: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  caption: string;
  order: number;
  images: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  images: string[];
  videos: string[];
}

export interface ContactData {
  description: string;
  email: string;
  phone: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}