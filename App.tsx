import React, { useState, useEffect, useCallback, useId } from 'react';
import { Section, HeroData, AboutData, EducationItem, SkillCategory, SkillItem, ExperienceItem, Certificate, Activity, ContactData, SocialLink, ThemeColors, MenuItem, BlogPost, EventItem, ProjectItem } from './types';
import * as api from './api';
import * as Icons from './components/icons';
import RichTextEditor from './components/RichTextEditor';

// --- UTILITY FUNCTIONS ---
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const getFilePreview = (file: string | undefined): string => {
  if (typeof file === 'string') return file; // Handles base64 strings and URLs
  return 'https://via.placeholder.com/150';
};

const hexToHslString = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
  } else { return "0 0% 0%"; } // Return black on parse error

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
};
const SocialIcon: React.FC<{name: SocialLink['name'], className?: string}> = ({ name, className }) => {
    switch (name) {
        case 'LinkedIn': return <Icons.LinkedInIcon className={className} />;
        case 'Twitter': return <Icons.TwitterIcon className={className} />;
        case 'Facebook': return <Icons.FacebookIcon className={className} />;
        case 'Instagram': return <Icons.InstagramIcon className={className} />;
        case 'GitHub': return null; // Add GitHub icon if needed
        default: return null;
    }
};
const SkillCategoryIcon: React.FC<{name: SkillCategory['iconName'], className?: string}> = ({ name, className }) => {
    switch (name) {
        case 'DataAnalytics': return <Icons.DataAnalyticsIcon className={className} />;
        case 'ProductivityTools': return <Icons.ProductivityToolsIcon className={className} />;
        case 'DesignTools': return <Icons.DesignToolsIcon className={className} />;
        case 'WebsiteDeveloper': return <Icons.WebsiteDeveloperIcon className={className} />;
        case 'VideoEditing': return <Icons.VideoEditingIcon className={className} />;
        default: return null;
    }
};
const ExperienceIcon: React.FC<{name: ExperienceItem['iconName'], className?: string}> = ({ name, className }) => {
    switch (name) {
        case 'ContentWriter': return <Icons.ContentWriterIcon className={className} />;
        case 'Projects': return <Icons.ProjectsIcon className={className} />;
        case 'Capstone': return <Icons.CapstoneIcon className={className} />;
        default: return null;
    }
};

const GlassCard: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-soft-lg ${className}`}>
        {children}
    </div>
);


// --- UI COMPONENTS ---
const SectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">{children}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
    </div>
)
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary transition" />
        </div>
    )
};
const ImageUpload: React.FC<{ label: string; currentImage: string; onFileChange: (file: File) => void }> = ({ label, currentImage, onFileChange }) => {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <img src={getFilePreview(currentImage)} alt="Preview" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <input id={id} type="file" accept="image/*" onChange={(e) => e.target.files && onFileChange(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
        </div>
    );
};


// --- PORTFOLIO SECTIONS (HOMEPAGE) ---

const Header: React.FC<{ menuItems: MenuItem[], currentPage: string, setScrollTo: (target: string) => void }> = ({ menuItems, currentPage, setScrollTo }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
        e.preventDefault();
        const target = item.link;

        if (item.isRoute) {
            window.location.hash = target;
        } else {
            if (currentPage === '#/') {
                document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                setScrollTo(target);
                window.location.hash = '#/';
            }
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-soft sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-primary">NR</div>
                <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
                    {menuItems.sort((a, b) => a.order - b.order).map(item => (
                        <li key={item.id}><a href={item.link} onClick={(e) => handleNavClick(e, item)} className="hover:text-primary transition-colors">{item.label}</a></li>
                    ))}
                </ul>
                <div className="flex items-center space-x-4">
                     <a href="#admin" onClick={(e) => handleNavClick(e, { id: 'admin-link', label: 'Admin', link: '#admin', isRoute: false, order: 999 })} className="hidden md:block hover:text-primary transition-colors font-medium">Admin</a>
                     <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                         <Icons.SignOutIcon className="w-5 h-5" />
                         <span className="font-medium">Logout</span>
                     </button>
                </div>
            </nav>
        </header>
    );
};

const Hero: React.FC<{data: HeroData | null}> = ({ data }) => {
    if (!data) return <div className="py-32 text-center">Loading...</div>;
    return (
    <section id="home" className="relative py-20 md:py-32 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
            <div className="inline-block p-1.5 bg-white rounded-full shadow-soft-lg mb-6">
                 <img src={getFilePreview(data.profilePhoto)} alt={data.name} className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{data.name}</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600">{data.tagline}</p>
            <div className="mt-8 flex justify-center items-center space-x-4">
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 flex items-center space-x-2" style={{background: 'linear-gradient(to right, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))'}}>
                    <Icons.MailIcon className="w-5 h-5" />
                    <span>Contact Me</span>
                </a>
            </div>
            <div className="mt-8 flex justify-center space-x-3">
                {data.socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-md transition-all duration-300">
                        <SocialIcon name={link.name} className="w-6 h-6" />
                    </a>
                ))}
            </div>
        </div>
    </section>
)};

const About: React.FC<{data: AboutData | null}> = ({ data }) => {
     if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>About Me</SectionTitle>
            <div className="max-w-3xl mx-auto text-center">
                <GlassCard className="p-8">
                    <p className="text-gray-600 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br />') }} />
                </GlassCard>
            </div>
        </div>
    </section>
)};

const AdminPanel: React.FC<{onEdit: (section: Section) => void}> = ({ onEdit }) => {
    const adminItems = [
        { label: "Edit Hero", section: Section.Hero },
        { label: "Edit About", section: Section.About },
        { label: "Manage Menu", section: Section.Menu },
        { label: "Manage Projects", section: Section.Projects },
        { label: "Manage Experience", section: Section.Experience },
        { label: "Manage Education", section: Section.Education },
        { label: "Manage Certificates", section: Section.Certificates },
        { label: "Update Skills", section: Section.Skills },
        { label: "Manage Activities", section: Section.Activities },
        { label: "Manage Blog", section: Section.Blog },
        { label: "Manage Events", section: Section.Events },
        { label: "Edit Contact", section: Section.Contact },
    ];
    return (
        <section id="admin" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800">Admin Panel</h3>
                    <p className="text-gray-500 mt-1 mb-2">Manage your portfolio content</p>
                    <p className="text-sm text-gray-500 mb-6">Logged in as: mdnishanrahman0@gmail.com</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {adminItems.map(item => (
                             <button key={item.section} onClick={() => onEdit(item.section)} className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform text-sm text-center">{item.label}</button>
                        ))}
                        <button onClick={() => onEdit(Section.Theme)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transform transition-transform text-sm text-center">Customize Theme</button>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
};

const BlogSection: React.FC<{data: BlogPost[] | null}> = ({data}) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="blog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Blog</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.filter(post => post.isPublished).map(post => (
                    <GlassCard key={post.id} className="p-6 flex flex-col">
                        {post.images.length > 0 && <img src={getFilePreview(post.images[0])} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4"/>}
                        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                        <p className="text-gray-600 mt-2 flex-grow">{post.content.substring(0, 100)}...</p>
                        <a href="#/blog" onClick={(e) => { e.preventDefault(); window.location.hash = '#/blog' }} className="text-primary font-semibold mt-4 self-start">Read More &rarr;</a>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};

const Contact: React.FC<{data: ContactData | null}> = ({ data }) => {
    const [formState, setFormState] = useState({ name: '', email: '', message: ''});
    if (!data) return <div className="py-20 text-center">Loading...</div>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleMessageChange = (value: string) => {
        setFormState(prev => ({ ...prev, message: value }));
    };

    return (
        <section id="contact" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>Get In Touch</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <GlassCard className="p-6 flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, hsl(var(--primary-hsl), .2), hsl(var(--accent-hsl), .2))'}}>
                                <Icons.PhoneIcon className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500">Phone</h4>
                                <p className="text-lg font-bold text-gray-800">{data.phone}</p>
                            </div>
                        </GlassCard>
                         <GlassCard className="p-6 flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, hsl(var(--primary-hsl), .2), hsl(var(--accent-hsl), .2))'}}>
                                <Icons.MailIcon className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500">Email</h4>
                                <p className="text-lg font-bold text-gray-800">{data.email}</p>
                            </div>
                        </GlassCard>
                        <p className="text-gray-600 leading-relaxed pt-4">{data.description}</p>
                    </div>

                    <GlassCard className="p-8">
                        <form className="space-y-6">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" id="name" placeholder="Your name" value={formState.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary transition" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" id="email" placeholder="your.email@example.com" value={formState.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary transition" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <RichTextEditor value={formState.message} onChange={handleMessageChange} placeholder="Your message..." rows={4} />
                            </div>
                            <button type="submit" className="w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 flex items-center justify-center space-x-2" style={{background: 'linear-gradient(to right, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))'}}>
                               <Icons.SendIcon className="w-5 h-5" />
                               <span>Send Message</span>
                            </button>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC<{name: string}> = ({ name }) => (
    <footer className="py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </div>
    </footer>
);

const FloatingActionButton: React.FC = () => (
    <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transform transition-transform duration-300 z-50" style={{background: 'linear-gradient(to right, hsl(var(--primary-hsl)), hsl(var(--accent-hsl)))'}}>
        <Icons.MessageCircleIcon className="w-8 h-8" />
    </a>
);

// --- SEPARATE PAGES ---
const ImageSlider: React.FC<{images: string[]}> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    if (images.length === 0) return null;

    const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    
    return (
        <>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                <img 
                    src={getFilePreview(images[currentIndex])} 
                    alt={`Slide ${currentIndex}`} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out cursor-zoom-in" 
                    onClick={() => setZoomedImage(getFilePreview(images[currentIndex]))}
                />
                {images.length > 1 && (
                    <>
                        <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
                        <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">›</button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}></div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {zoomedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    onClick={() => setZoomedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Zoomed image view"
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300"
                        onClick={() => setZoomedImage(null)}
                        aria-label="Close zoomed image"
                    >
                        <Icons.CloseIcon className="w-8 h-8" />
                    </button>
                    <img 
                        src={zoomedImage} 
                        alt="Zoomed view" 
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
};

const ProjectsPage: React.FC<{data: ProjectItem[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <div id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map(project => (
                    <GlassCard key={project.id} className="p-6 flex flex-col">
                        <ImageSlider images={project.images} />
                        <div className="flex justify-between items-center mt-4">
                            <h3 className="text-2xl font-bold text-gray-800">{project.title}</h3>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                    <span>View Project</span>
                                    <Icons.ExternalLinkIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        <div className="text-gray-600 mt-2 flex-grow" dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }} />

                        {project.videos.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Related Videos:</h4>
                                <div className="space-y-1">
                                    {project.videos.map((video, index) => (
                                        <a key={index} href={video} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate text-sm">
                                            {video}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </GlassCard>
                ))}
                 {data.length === 0 && <p className="text-center text-gray-500 md:col-span-2">No projects added yet. Add some from the admin panel!</p>}
            </div>
        </div>
    </div>
)};
const EducationPage: React.FC<{data: EducationItem[] | null}> = ({data}) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="education" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-8 max-w-4xl mx-auto">
                {data.map(item => (
                    <GlassCard key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <img src={getFilePreview(item.logo)} alt={`${item.institution} logo`} className="w-16 h-16 object-contain"/>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">{item.institution} <a href={item.link} target="_blank" rel="noopener noreferrer"><Icons.ExternalLinkIcon className="w-4 h-4 ml-2 text-primary" /></a></h3>
                                <p className="text-primary font-semibold">{item.degree}</p>
                                <p className="text-gray-500 text-sm mt-1 flex items-center"><span className="mr-2">🗓️</span>{item.duration}</p>
                            </div>
                            <img src={getFilePreview(item.campusImage)} alt={`${item.institution} campus`} className="w-full sm:w-40 h-auto rounded-lg object-cover" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};
const CertificatesPage: React.FC<{data: Certificate[] | null}> = ({data}) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="certificates" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Certificates</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map(cert => (
                    <GlassCard key={cert.id} className="p-6 text-center">
                        <img src={getFilePreview(cert.image)} alt={cert.title} className="w-full h-auto rounded-lg mb-4 border" />
                        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2"><Icons.LockIcon className="w-5 h-5 text-gray-400"/> {cert.title}</h3>
                        <p className="text-gray-500">{cert.issuer}</p>
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                <Icons.CheckCircleIcon className="w-6 h-6" />
                            </div>
                        </a>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};
const SkillsPage: React.FC<{data: SkillCategory[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Skills</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map(category => (
                    <GlassCard key={category.id} className="p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center mr-4" style={{background: 'linear-gradient(to bottom right, hsl(var(--primary-hsl), .2), hsl(var(--accent-hsl), .2))'}}>
                                <SkillCategoryIcon name={category.iconName} className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map(skill => (
                                <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{skill.name}</span>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};
const ExperiencePage: React.FC<{data: ExperienceItem[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Work Experience & Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map(item => (
                    <GlassCard key={item.id} className="p-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center mb-4" style={{background: 'linear-gradient(to bottom right, hsl(var(--primary-hsl), .2), hsl(var(--accent-hsl), .2))'}}>
                             <ExperienceIcon name={item.iconName} className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <p className="font-semibold text-primary">{item.company}</p>
                        <p className="text-sm text-gray-500 my-1">🗓️ {item.duration}</p>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};
const ActivitiesPage: React.FC<{data: Activity[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <section id="activities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Extracurricular Activities</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {data.map(item => (
                    <GlassCard key={item.id} className="p-8 text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center mb-4 mx-auto" style={{background: 'linear-gradient(to bottom right, hsl(var(--primary-hsl), .2), hsl(var(--accent-hsl), .2))'}}>
                             <Icons.ExtracurricularIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <p className="font-semibold text-primary">{item.organization}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    </section>
)};
const EventsPage: React.FC<{data: EventItem[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <div id="events" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Events & Feed</SectionTitle>
            <div className="space-y-12 max-w-4xl mx-auto">
                {data.sort((a,b) => b.order - a.order).map(event => (
                    <GlassCard key={event.id} className="p-6">
                        <ImageSlider images={event.images} />
                        <h3 className="text-2xl font-bold text-gray-800 mt-4">{event.title}</h3>
                        <p className="text-primary font-semibold">{event.caption}</p>
                        <div className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }} />
                    </GlassCard>
                ))}
            </div>
        </div>
    </div>
)};
const BlogPage: React.FC<{data: BlogPost[] | null}> = ({ data }) => {
    if (!data) return <div className="py-20 text-center">Loading...</div>;
    return (
    <div id="blog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>Blog</SectionTitle>
            <div className="space-y-12 max-w-4xl mx-auto">
                {data.filter(p => p.isPublished).map(post => (
                    <GlassCard key={post.id} className="p-6">
                        {post.images.length > 0 && <img src={getFilePreview(post.images[0])} alt={post.title} className="w-full aspect-video object-cover rounded-lg mb-4"/>}
                        <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
                        <p className="text-gray-600 mt-4 whitespace-pre-wrap">{post.content}</p>
                        {post.videos.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Related Videos:</h4>
                                {post.videos.map((video, index) => <a key={index} href={video} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block truncate">{video}</a>)}
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>
        </div>
    </div>
)};


// --- MAIN APP ---
const App: React.FC = () => {
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [currentPage, setCurrentPage] = useState(window.location.hash || '#/');
  const [scrollTo, setScrollTo] = useState<string | null>(null);
  
  // States for all sections
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [educationData, setEducationData] = useState<EducationItem[] | null>(null);
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [skillData, setSkillData] = useState<SkillCategory[] | null>(null);
  const [experience, setExperience] = useState<ExperienceItem[] | null>(null);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [projects, setProjects] = useState<ProjectItem[] | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [theme, setTheme] = useState<ThemeColors | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  
  // Temporary states for modals
  const [tempHero, setTempHero] = useState<HeroData | null>(null);
  const [tempAbout, setTempAbout] = useState<AboutData | null>(null);
  const [tempEducation, setTempEducation] = useState<EducationItem[] | null>(null);
  const [tempCertificates, setTempCertificates] = useState<Certificate[] | null>(null);
  const [tempSkills, setTempSkills] = useState<SkillCategory[] | null>(null);
  const [tempExperience, setTempExperience] = useState<ExperienceItem[] | null>(null);
  const [tempActivities, setTempActivities] = useState<Activity[] | null>(null);
  const [tempProjects, setTempProjects] = useState<ProjectItem[] | null>(null);
  const [tempBlogPosts, setTempBlogPosts] = useState<BlogPost[] | null>(null);
  const [tempEvents, setTempEvents] = useState<EventItem[] | null>(null);
  const [tempContact, setTempContact] = useState<ContactData | null>(null);
  const [tempTheme, setTempTheme] = useState<ThemeColors | null>(null);
  const [tempMenuItems, setTempMenuItems] = useState<MenuItem[] | null>(null);

  const loadAllData = useCallback(async () => {
    setHeroData(await api.getHeroData());
    setAboutData(await api.getAboutData());
    setEducationData(await api.getEducationData());
    setCertificates(await api.getCertificates());
    setSkillData(await api.getSkillData());
    setExperience(await api.getExperience());
    setActivities(await api.getActivities());
    setProjects(await api.getProjects());
    setBlogPosts(await api.getBlogPosts());
    setEvents(await api.getEvents());
    setContact(await api.getContact());
    setTheme(await api.getTheme());
    setMenuItems(await api.getMenuItems());
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-hsl', hexToHslString(theme.primary));
      root.style.setProperty('--secondary-hsl', hexToHslString(theme.secondary));
      root.style.setProperty('--accent-hsl', hexToHslString(theme.accent));
      root.style.setProperty('--bg-start-hsl', hexToHslString(theme.bgStart));
      root.style.setProperty('--bg-mid-hsl', hexToHslString(theme.bgMid));
      root.style.setProperty('--bg-end-hsl', hexToHslString(theme.bgEnd));
    }
  }, [theme]);
  
  useEffect(() => {
    const handleHashChange = () => {
        setCurrentPage(window.location.hash || '#/');
        window.scrollTo(0, 0); // Scroll to top on page change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    if (currentPage === '#/' && scrollTo) {
        setTimeout(() => {
            document.querySelector(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
            setScrollTo(null);
        }, 100);
    }
  }, [currentPage, scrollTo]);

  const handleEdit = (section: Section) => {
    // On open, reset temp state to match current state
    switch(section) {
      case Section.Hero: setTempHero(heroData); break;
      case Section.About: setTempAbout(aboutData); break;
      case Section.Education: setTempEducation(educationData); break;
      case Section.Certificates: setTempCertificates(certificates); break;
      case Section.Skills: setTempSkills(skillData); break;
      case Section.Experience: setTempExperience(experience); break;
      case Section.Activities: setTempActivities(activities); break;
      case Section.Projects: setTempProjects(projects); break;
      case Section.Blog: setTempBlogPosts(blogPosts); break;
      case Section.Events: setTempEvents(events); break;
      case Section.Contact: setTempContact(contact); break;
      case Section.Theme: setTempTheme(theme); break;
      case Section.Menu: setTempMenuItems(menuItems); break;
    }
    setEditingSection(section);
  };
  
  const handleCloseModal = () => setEditingSection(null);

  const handleSave = async () => {
    if (!editingSection) return;
    
    switch(editingSection) {
      case Section.Hero: if(tempHero) await api.saveHeroData(tempHero); break;
      case Section.About: if(tempAbout) await api.saveAboutData(tempAbout); break;
      case Section.Education: if(tempEducation) await api.saveEducationData(tempEducation); break;
      case Section.Certificates: if(tempCertificates) await api.saveCertificates(tempCertificates); break;
      case Section.Skills: if(tempSkills) await api.saveSkillData(tempSkills); break;
      case Section.Experience: if(tempExperience) await api.saveExperience(tempExperience); break;
      case Section.Activities: if(tempActivities) await api.saveActivities(tempActivities); break;
      case Section.Projects: if(tempProjects) await api.saveProjects(tempProjects); break;
      case Section.Blog: if(tempBlogPosts) await api.saveBlogPosts(tempBlogPosts); break;
      case Section.Events: if(tempEvents) await api.saveEvents(tempEvents); break;
      case Section.Contact: if(tempContact) await api.saveContact(tempContact); break;
      case Section.Theme: if(tempTheme) await api.saveTheme(tempTheme); break;
      case Section.Menu: if(tempMenuItems) await api.saveMenuItems(tempMenuItems); break;
    }
    await loadAllData();
    handleCloseModal();
  };

  const renderEditModal = () => {
      if (!editingSection) return null;

      let modalContent;

      switch (editingSection) {
        case Section.Hero: {
            if (!tempHero) return null;
            const handleFieldChange = (field: keyof HeroData, value: any) => setTempHero(prev => prev ? ({ ...prev, [field]: value }) : null);
            const handleSocialChange = (id: string, value: string) => {
                if (!tempHero) return;
                const newLinks = tempHero.socialLinks.map(link => link.id === id ? { ...link, url: value } : link);
                handleFieldChange('socialLinks', newLinks);
            };

            modalContent = (
                <div className="space-y-4">
                    <FormInput label="Name" value={tempHero.name} onChange={e => handleFieldChange('name', e.target.value)} />
                    <FormInput label="Tagline" value={tempHero.tagline} onChange={e => handleFieldChange('tagline', e.target.value)} />
                    <ImageUpload label="Profile Photo" currentImage={tempHero.profilePhoto} onFileChange={async file => handleFieldChange('profilePhoto', await fileToBase64(file))} />
                    <h3 className="text-lg font-medium pt-2">Social Links</h3>
                    {tempHero.socialLinks.map(link => (
                        <FormInput key={link.id} label={link.name} value={link.url} onChange={e => handleSocialChange(link.id, e.target.value)} />
                    ))}
                </div>
            );
            break;
        }
        case Section.About: {
            if (!tempAbout) return null;
            modalContent = (
                <RichTextEditor
                    value={tempAbout.content}
                    onChange={(newContent) => setTempAbout({ content: newContent })}
                    placeholder="Write about yourself..."
                    rows={10}
                />
            );
            break;
        }
        case Section.Contact: {
            if (!tempContact) return null;
            const handleChange = (field: keyof ContactData, value: string) => setTempContact(p => p ? ({...p, [field]: value}) : null);
            modalContent = (
                <div className="space-y-4">
                    <FormInput label="Phone Number" value={tempContact.phone} onChange={e => handleChange('phone', e.target.value)} />
                    <FormInput label="Email Address" value={tempContact.email} onChange={e => handleChange('email', e.target.value)} />
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <RichTextEditor value={tempContact.description} onChange={v => handleChange('description', v)} rows={6} />
                </div>
            );
            break;
        }
        case Section.Education: {
            if (!tempEducation) return null;
            const handleUpdate = (id: string, field: string, value: any) => {
                setTempEducation(tempEducation.map(item => item.id === id ? { ...item, [field]: value } : item));
            };
            const handleDelete = (id: string) => setTempEducation(tempEducation.filter(item => item.id !== id));
            const handleAdd = () => setTempEducation([...tempEducation, { id: Date.now().toString(), institution: '', degree: '', duration: '', logo: '', campusImage: '', link: '' }]);
            
            modalContent = (
                <div className="space-y-6">
                    {tempEducation.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                           <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                           </div>
                            <FormInput label="Institution" value={item.institution} onChange={e => handleUpdate(item.id, 'institution', e.target.value)} />
                            <FormInput label="Degree" value={item.degree} onChange={e => handleUpdate(item.id, 'degree', e.target.value)} />
                            <FormInput label="Duration" value={item.duration} onChange={e => handleUpdate(item.id, 'duration', e.target.value)} />
                            <FormInput label="Link" value={item.link} onChange={e => handleUpdate(item.id, 'link', e.target.value)} />
                            <ImageUpload label="Logo" currentImage={item.logo} onFileChange={async file => handleUpdate(item.id, 'logo', await fileToBase64(file))} />
                            <ImageUpload label="Campus Image" currentImage={item.campusImage} onFileChange={async file => handleUpdate(item.id, 'campusImage', await fileToBase64(file))} />
                        </div>
                    ))}
                    <button onClick={handleAdd} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Item
                    </button>
                </div>
            );
            break;
        }
        case Section.Certificates: {
            if (!tempCertificates) return null;
            const handleUpdate = (id: string, field: string, value: any) => {
                setTempCertificates(tempCertificates.map(item => item.id === id ? { ...item, [field]: value } : item));
            };
            const handleDelete = (id: string) => setTempCertificates(tempCertificates.filter(item => item.id !== id));
            const handleAdd = () => setTempCertificates([...tempCertificates, { id: Date.now().toString(), title: '', issuer: '', image: '', link: '' }]);

            modalContent = (
                <div className="space-y-6">
                    {tempCertificates.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                           <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                           </div>
                           <FormInput label="Title" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
                           <FormInput label="Issuer" value={item.issuer} onChange={e => handleUpdate(item.id, 'issuer', e.target.value)} />
                           <FormInput label="Link" value={item.link} onChange={e => handleUpdate(item.id, 'link', e.target.value)} />
                           <ImageUpload label="Certificate Image" currentImage={item.image} onFileChange={async file => handleUpdate(item.id, 'image', await fileToBase64(file))} />
                        </div>
                    ))}
                    <button onClick={handleAdd} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Item
                    </button>
                </div>
            );
            break;
        }
        case Section.Experience: {
            if (!tempExperience) return null;
            const handleUpdate = (id: string, field: string, value: any) => {
                setTempExperience(tempExperience.map(item => item.id === id ? { ...item, [field]: value } : item));
            };
            const handleDelete = (id: string) => setTempExperience(tempExperience.filter(item => item.id !== id));
            const handleAdd = () => setTempExperience([...tempExperience, { id: Date.now().toString(), title: '', company: '', duration: '', iconName: 'ContentWriter', description: '' }]);

             modalContent = (
                <div className="space-y-6">
                    {tempExperience.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                           <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                           </div>
                            <FormInput label="Title" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
                            <FormInput label="Company" value={item.company} onChange={e => handleUpdate(item.id, 'company', e.target.value)} />
                            <FormInput label="Duration" value={item.duration} onChange={e => handleUpdate(item.id, 'duration', e.target.value)} />
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={item.description} onChange={e => handleUpdate(item.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary transition" rows={3}/>
                        </div>
                    ))}
                    <button onClick={handleAdd} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Item
                    </button>
                </div>
            );
            break;
        }
        case Section.Activities: {
            if (!tempActivities) return null;
            const handleUpdate = (id: string, field: string, value: any) => {
                setTempActivities(tempActivities.map(item => item.id === id ? { ...item, [field]: value } : item));
            };
            const handleDelete = (id: string) => setTempActivities(tempActivities.filter(item => item.id !== id));
            const handleAdd = () => setTempActivities([...tempActivities, { id: Date.now().toString(), title: '', organization: '', duration: '', iconName: 'Extracurricular' }]);

            modalContent = (
                <div className="space-y-6">
                    {tempActivities.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                           <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                           </div>
                            <FormInput label="Title" value={item.title} onChange={e => handleUpdate(item.id, 'title', e.target.value)} />
                            <FormInput label="Organization" value={item.organization} onChange={e => handleUpdate(item.id, 'organization', e.target.value)} />
                            <FormInput label="Duration" value={item.duration} onChange={e => handleUpdate(item.id, 'duration', e.target.value)} />
                        </div>
                    ))}
                    <button onClick={handleAdd} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Item
                    </button>
                </div>
            );
            break;
        }
        case Section.Skills: {
            if (!tempSkills) return null;
            const handleCategoryTitleChange = (catId: string, newTitle: string) => {
                setTempSkills(tempSkills.map(cat => cat.id === catId ? { ...cat, title: newTitle } : cat));
            };
            const handleSkillNameChange = (catId: string, skillId: string, newName: string) => {
                setTempSkills(tempSkills.map(cat => cat.id === catId ? { ...cat, skills: cat.skills.map(skill => skill.id === skillId ? { ...skill, name: newName } : skill) } : cat));
            };
            const handleDeleteSkill = (catId: string, skillId: string) => {
                setTempSkills(tempSkills.map(cat => cat.id === catId ? { ...cat, skills: cat.skills.filter(skill => skill.id !== skillId) } : cat));
            };
            const handleAddSkill = (catId: string) => {
                const newSkill: SkillItem = { id: Date.now().toString(), name: 'New Skill' };
                setTempSkills(tempSkills.map(cat => cat.id === catId ? { ...cat, skills: [...cat.skills, newSkill] } : cat));
            };

            modalContent = (
                <div className="space-y-6">
                    {tempSkills.map(category => (
                        <div key={category.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                            <FormInput label="Category Title" value={category.title} onChange={e => handleCategoryTitleChange(category.id, e.target.value)} />
                            <div className="space-y-2 pl-4 border-l-2">
                                {category.skills.map(skill => (
                                    <div key={skill.id} className="flex items-center gap-2">
                                        <input value={skill.name} onChange={e => handleSkillNameChange(category.id, skill.id, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md"/>
                                        <button onClick={() => handleDeleteSkill(category.id, skill.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddSkill(category.id)} className="text-sm text-primary font-semibold hover:underline">+ Add skill</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
            break;
        }
         case Section.Projects: {
            if (!tempProjects) return null;
            const handleUpdateProject = (id: string, field: keyof ProjectItem, value: any) => {
                setTempProjects(tempProjects.map(p => p.id === id ? { ...p, [field]: value } : p));
            };
            const handleDeleteProject = (id: string) => setTempProjects(tempProjects.filter(p => p.id !== id));
            const handleAddProject = () => {
                const newProject: ProjectItem = { id: Date.now().toString(), title: 'New Project', description: '', images: [], videos: [], link: '' };
                setTempProjects([...tempProjects, newProject]);
            };
            const handleImageAdd = async (projId: string, file: File) => {
                const base64 = await fileToBase64(file);
                setTempProjects(tempProjects.map(p => p.id === projId ? { ...p, images: [...p.images, base64] } : p));
            };
            const handleImageDelete = (projId: string, imageIndex: number) => {
                 setTempProjects(tempProjects.map(p => p.id === projId ? { ...p, images: p.images.filter((_, i) => i !== imageIndex) } : p));
            };
            const handleVideoChange = (projId: string, videoIndex: number, newUrl: string) => {
                setTempProjects(tempProjects.map(p => {
                    if (p.id === projId) {
                        const newVideos = [...p.videos];
                        newVideos[videoIndex] = newUrl;
                        return { ...p, videos: newVideos };
                    }
                    return p;
                }));
            };
            const handleAddVideo = (projId: string) => {
                setTempProjects(tempProjects.map(p => p.id === projId ? { ...p, videos: [...p.videos, ''] } : p));
            };
            const handleDeleteVideo = (projId: string, videoIndex: number) => {
                setTempProjects(tempProjects.map(p => p.id === projId ? { ...p, videos: p.videos.filter((_, i) => i !== videoIndex) } : p));
            };

            modalContent = (
                <div className="space-y-6">
                    {tempProjects.map((project, index) => (
                        <div key={project.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                            <div className="flex justify-between items-center"><h4 className="font-bold text-gray-700">Project #{index + 1}</h4><button onClick={() => handleDeleteProject(project.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button></div>
                            <FormInput label="Title" value={project.title} onChange={e => handleUpdateProject(project.id, 'title', e.target.value)} />
                            <FormInput label="Project Link" value={project.link} onChange={e => handleUpdateProject(project.id, 'link', e.target.value)} />
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <RichTextEditor value={project.description} onChange={v => handleUpdateProject(project.id, 'description', v)} rows={5} />
                            
                            <h5 className="font-medium text-gray-600 pt-2">Images</h5>
                            <div className="grid grid-cols-3 gap-2">{project.images.map((img, imgIndex) => (<div key={imgIndex} className="relative group"><img src={getFilePreview(img)} className="w-full h-24 object-cover rounded"/><button onClick={() => handleImageDelete(project.id, imgIndex)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Icons.CloseIcon className="w-3 h-3"/></button></div>))}</div>
                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageAdd(project.id, e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            
                            <h5 className="font-medium text-gray-600 pt-2">Video Links</h5>
                            <div className="space-y-2 pl-4 border-l-2">{project.videos.map((videoUrl, videoIndex) => (<div key={videoIndex} className="flex items-center gap-2"><input value={videoUrl} placeholder="https://youtube.com/..." onChange={e => handleVideoChange(project.id, videoIndex, e.target.value)} className="flex-grow px-2 py-1 border rounded-md"/><button onClick={() => handleDeleteVideo(project.id, videoIndex)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-4 h-4"/></button></div>))}<button onClick={() => handleAddVideo(project.id)} className="text-sm text-primary font-semibold hover:underline">+ Add video link</button></div>
                        </div>
                    ))}
                    <button onClick={handleAddProject} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 flex items-center justify-center gap-2"><Icons.PlusIcon className="w-5 h-5"/> Add New Project</button>
                </div>
            );
            break;
        }
        case Section.Blog: {
            if (!tempBlogPosts) return null;
            const handleUpdatePost = (id: string, field: keyof BlogPost, value: any) => {
                setTempBlogPosts(tempBlogPosts.map(post => post.id === id ? { ...post, [field]: value } : post));
            };
            const handleDeletePost = (id: string) => {
                setTempBlogPosts(tempBlogPosts.filter(post => post.id !== id));
            };
            const handleAddPost = () => {
                const newPost: BlogPost = { id: Date.now().toString(), title: 'New Post', content: '', isPublished: false, images: [], videos: [] };
                setTempBlogPosts([...tempBlogPosts, newPost]);
            };
            const handleImageAdd = async (postId: string, file: File) => {
                const base64 = await fileToBase64(file);
                setTempBlogPosts(tempBlogPosts.map(p => p.id === postId ? { ...p, images: [...p.images, base64] } : p));
            };
            const handleImageDelete = (postId: string, imageIndex: number) => {
                setTempBlogPosts(tempBlogPosts.map(p => p.id === postId ? { ...p, images: p.images.filter((_, i) => i !== imageIndex) } : p));
            };
            const handleVideoChange = (postId: string, videoIndex: number, newUrl: string) => {
                setTempBlogPosts(tempBlogPosts.map(post => {
                    if (post.id === postId) {
                        const newVideos = [...post.videos];
                        newVideos[videoIndex] = newUrl;
                        return { ...post, videos: newVideos };
                    }
                    return post;
                }));
            };
            const handleAddVideo = (postId: string) => {
                setTempBlogPosts(tempBlogPosts.map(post => {
                    if (post.id === postId) {
                        return { ...post, videos: [...post.videos, ''] };
                    }
                    return post;
                }));
            };
            const handleDeleteVideo = (postId: string, videoIndex: number) => {
                setTempBlogPosts(tempBlogPosts.map(post => {
                    if (post.id === postId) {
                        const newVideos = post.videos.filter((_, index) => index !== videoIndex);
                        return { ...post, videos: newVideos };
                    }
                    return post;
                }));
            };

            modalContent = (
                <div className="space-y-6">
                    {tempBlogPosts.map((post, index) => (
                        <div key={post.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Post #{index + 1}</h4>
                                <button onClick={() => handleDeletePost(post.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                            </div>
                            <FormInput label="Title" value={post.title} onChange={e => handleUpdatePost(post.id, 'title', e.target.value)} />
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <RichTextEditor value={post.content} onChange={v => handleUpdatePost(post.id, 'content', v)} rows={5} />
                             <h5 className="font-medium text-gray-600 pt-2">Images</h5>
                            <div className="grid grid-cols-3 gap-2">{post.images.map((img, imgIndex) => (<div key={imgIndex} className="relative group"><img src={getFilePreview(img)} className="w-full h-24 object-cover rounded"/><button onClick={() => handleImageDelete(post.id, imgIndex)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Icons.CloseIcon className="w-3 h-3"/></button></div>))}</div>
                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageAdd(post.id, e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            <h5 className="font-medium text-gray-600 pt-2">Video Links</h5>
                            <div className="space-y-2 pl-4 border-l-2">
                                {post.videos.map((videoUrl, videoIndex) => (
                                    <div key={videoIndex} className="flex items-center gap-2">
                                        <input value={videoUrl} placeholder="https://youtube.com/..." onChange={e => handleVideoChange(post.id, videoIndex, e.target.value)} className="flex-grow px-2 py-1 border border-gray-200 rounded-md"/>
                                        <button onClick={() => handleDeleteVideo(post.id, videoIndex)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddVideo(post.id)} className="text-sm text-primary font-semibold hover:underline">+ Add video link</button>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={post.isPublished} onChange={e => handleUpdatePost(post.id, 'isPublished', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <label className="text-sm font-medium text-gray-700">Published</label>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAddPost} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Blog Post
                    </button>
                </div>
            );
            break;
        }
        case Section.Events: {
            if (!tempEvents) return null;
            const handleUpdateEvent = (id: string, field: keyof EventItem, value: any) => {
                setTempEvents(tempEvents.map(event => event.id === id ? { ...event, [field]: value } : event));
            };
            const handleDeleteEvent = (id: string) => {
                setTempEvents(tempEvents.filter(event => event.id !== id));
            };
            const handleAddEvent = () => {
                const newEvent: EventItem = { id: Date.now().toString(), title: 'New Event', description: '', caption: '', order: tempEvents.length + 1, images: [] };
                setTempEvents([...tempEvents, newEvent]);
            };
            const handleImageAdd = async (eventId: string, file: File) => {
                const base64 = await fileToBase64(file);
                setTempEvents(tempEvents.map(event => {
                    if (event.id === eventId) {
                        return { ...event, images: [...event.images, base64] };
                    }
                    return event;
                }));
            };
            const handleImageDelete = (eventId: string, imageIndex: number) => {
                 setTempEvents(tempEvents.map(event => {
                    if (event.id === eventId) {
                        return { ...event, images: event.images.filter((_, i) => i !== imageIndex) };
                    }
                    return event;
                }));
            };

            modalContent = (
                <div className="space-y-6">
                    {tempEvents.map((event, index) => (
                        <div key={event.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                             <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Event #{index + 1}</h4>
                                <button onClick={() => handleDeleteEvent(event.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                            </div>
                            <FormInput label="Title" value={event.title} onChange={e => handleUpdateEvent(event.id, 'title', e.target.value)} />
                            <FormInput label="Caption" value={event.caption} onChange={e => handleUpdateEvent(event.id, 'caption', e.target.value)} />
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <RichTextEditor value={event.description} onChange={v => handleUpdateEvent(event.id, 'description', v)} rows={4} />
                            <FormInput label="Order" type="number" value={event.order} onChange={e => handleUpdateEvent(event.id, 'order', parseInt(e.target.value, 10))} />

                            <h5 className="font-medium text-gray-600 pt-2">Images</h5>
                             <div className="grid grid-cols-3 gap-2">
                                {event.images.map((img, imgIndex) => (
                                    <div key={imgIndex} className="relative group">
                                        <img src={getFilePreview(img)} className="w-full h-24 object-cover rounded"/>
                                        <button onClick={() => handleImageDelete(event.id, imgIndex)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icons.CloseIcon className="w-3 h-3"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageAdd(event.id, e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                    ))}
                     <button onClick={handleAddEvent} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add New Event
                    </button>
                </div>
            );
            break;
        }
        case Section.Theme: {
            if (!tempTheme) return null;
            const ColorInput: React.FC<{
              label: string;
              value: string;
              onChange: (value: string) => void;
            }> = ({ label, value, onChange }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="p-0 border-0 rounded-lg cursor-pointer bg-white w-14 h-14"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            );

            modalContent = (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Accent Colors</h3>
                <ColorInput label="Primary Color" value={tempTheme.primary} onChange={(c) => setTempTheme(p => p ? ({...p, primary: c}) : null)}/>
                <ColorInput label="Secondary Color" value={tempTheme.secondary} onChange={(c) => setTempTheme(p => p ? ({...p, secondary: c}) : null)}/>
                <ColorInput label="Accent Color" value={tempTheme.accent} onChange={(c) => setTempTheme(p => p ? ({...p, accent: c}) : null)}/>
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2 pt-4">Background Gradient</h3>
                <ColorInput label="Gradient Start Color" value={tempTheme.bgStart} onChange={(c) => setTempTheme(p => p ? ({...p, bgStart: c}) : null)}/>
                <ColorInput label="Gradient Middle Color" value={tempTheme.bgMid} onChange={(c) => setTempTheme(p => p ? ({...p, bgMid: c}) : null)}/>
                <ColorInput label="Gradient End Color" value={tempTheme.bgEnd} onChange={(c) => setTempTheme(p => p ? ({...p, bgEnd: c}) : null)}/>
              </div>
            );
            break;
        }
        case Section.Menu: {
            if (!tempMenuItems) return null;
            const handleUpdate = (id: string, field: keyof MenuItem, value: string | number | boolean) => {
                setTempMenuItems(tempMenuItems.map(item => item.id === id ? { ...item, [field]: value } : item));
            };
            const handleDelete = (id: string) => setTempMenuItems(tempMenuItems.filter(item => item.id !== id));
            const handleAdd = () => setTempMenuItems([...tempMenuItems, { id: Date.now().toString(), label: 'New Link', link: '#', isRoute: false, order: tempMenuItems.length + 1 }]);
            
            modalContent = (
                <div className="space-y-6">
                    {tempMenuItems.sort((a,b) => a.order - b.order).map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                           <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">{item.label}</h4>
                                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Icons.DeleteIcon className="w-5 h-5"/></button>
                           </div>
                            <FormInput label="Label" value={item.label} onChange={e => handleUpdate(item.id, 'label', e.target.value)} />
                            <FormInput label="Link (e.g., #about or #/blog)" value={item.link} onChange={e => handleUpdate(item.id, 'link', e.target.value)} />
                            <FormInput label="Order" type="number" value={item.order} onChange={e => handleUpdate(item.id, 'order', parseInt(e.target.value, 10) || 0)} />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id={`isRoute-${item.id}`} checked={item.isRoute} onChange={e => handleUpdate(item.id, 'isRoute', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <label htmlFor={`isRoute-${item.id}`} className="text-sm font-medium text-gray-700">Is Page Route (for separate pages like Blog/Events)</label>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAdd} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2">
                        <Icons.PlusIcon className="w-5 h-5"/> Add Menu Item
                    </button>
                </div>
            );
            break;
        }
        default:
            modalContent = <p>Editing for this section is not implemented yet.</p>;
            break;
      }

      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={handleCloseModal}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Editing: {editingSection}</h2>
                    <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                        <Icons.CloseIcon className="w-7 h-7" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {modalContent}
                </div>
                 <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button onClick={handleCloseModal} className="px-5 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 mr-2">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90">
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
      )
  }

  const renderPage = () => {
    switch(currentPage) {
        case '#/events': return <EventsPage data={events} />;
        case '#/blog': return <BlogPage data={blogPosts} />;
        case '#/projects': return <ProjectsPage data={projects} />;
        case '#/education': return <EducationPage data={educationData} />;
        case '#/certificates': return <CertificatesPage data={certificates} />;
        case '#/skills': return <SkillsPage data={skillData} />;
        case '#/experience': return <ExperiencePage data={experience} />;
        case '#/activities': return <ActivitiesPage data={activities} />;
        case '#/':
        default:
            return (
                <>
                    <Hero data={heroData} />
                    <About data={aboutData} />
                    <AdminPanel onEdit={handleEdit} />
                    <BlogSection data={blogPosts} />
                    <Contact data={contact} />
                </>
            )
    }
  }

  if (!theme || !menuItems || !heroData) {
    return <div className="min-h-screen flex items-center justify-center">Loading Portfolio...</div>
  }

  return (
    <div className="font-sans text-gray-800">
      <Header menuItems={menuItems} currentPage={currentPage} setScrollTo={setScrollTo} />
      <main>
        {renderPage()}
      </main>
      <Footer name={heroData.name} />
      {currentPage === '#/' && <FloatingActionButton />}
      {renderEditModal()}
    </div>
  );
};

export default App;
