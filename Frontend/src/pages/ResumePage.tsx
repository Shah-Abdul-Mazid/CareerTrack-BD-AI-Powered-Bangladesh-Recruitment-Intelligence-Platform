import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Award, Briefcase, 
  GraduationCap, Sparkles, Copy, Check, ExternalLink,
  Code2, Cpu, Globe, Mail, Phone, MapPin, BookOpen,
  Layers, FolderGit2, UserCheck, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResumePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'shahabdulmazid.ezan@yahoo.com';

  const [copiedCvId, setCopiedCvId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'projects' | 'publications' | 'skills' | 'education'>('overview');

  const profile = {
    name: 'Shah Abdul Mazid',
    banglaName: 'শাহ আব্দুল মাজিদ',
    title: 'AI/ML Engineer & Researcher',
    tagline: 'Generative AI | LLMs & RAG | Computer Vision | NLP | Deep Learning',
    cvId: '2052062-338528',
    father: 'Shah Mohammad Monir Uddin',
    mother: 'Yesmin Khanom',
    dob: '01 June, 2001 (25 Years 3 Months 1 Days)',
    nid: '1511276758',
    phone: '+880 1531329222',
    email: 'shahabdulmazid.ezan@yahoo.com',
    location: 'Dhaka, Bangladesh',
    address: '14/14, Block-C, Tajmohol Road, Mohammadpur, Dhaka-1207',
    
    links: {
      github: 'https://github.com/Shah-Abdul-Mazid',
      orcid: 'https://orcid.org/0009-0009-6864-154X',
      researchgate: 'https://www.researchgate.net/profile/Shah-Abdul-Mazid',
      scholar: 'https://scholar.google.com/citations?user=dHCRVNLNMZb-zFU10',
      linkedin: 'https://linkedin.com/in/shahabdulmazid',
      portfolio: 'https://shahabdulmazid.me',
    },

    summary: `AI/ML Engineer with a B.Sc. in Computer Science and Engineering from East West University, majoring in Intelligent Systems and Data Science. Experienced in Generative AI, LLMs, RAG, Machine Learning, Deep Learning, Computer Vision, and NLP. Skilled in building production-ready AI applications using Python, PyTorch, TensorFlow, FastAPI, Pinecone, OpenAI APIs, and AWS. Passionate about AI research and developing intelligent, real-world solutions for government, banking, enterprise, and healthcare domains.`,

    highlights: [
      { label: 'Published Research', value: '2 Papers', desc: 'IEEE ICCIT 2025 & Springer ICIDA 2026', icon: BookOpen, color: '#a855f7' },
      { label: 'Enterprise RAG Platform', value: '10K+ Docs', desc: '95%+ semantic retrieval accuracy', icon: Cpu, color: '#3b82f6' },
      { label: 'Specialized Certifications', value: '17+ Badges', desc: 'IBM, AWS & DeepLearning.AI accredited', icon: Award, color: '#10b981' },
      { 
        value: 'EWU B.Sc. in Computer Science and Engineering', 
        label: '', 
        desc: 'Major : Intelligent System and Data Science', 
        isDegree: true,
        icon: GraduationCap, 
        color: '#f59e0b' 
      },
    ],

    experience: [
      {
        role: 'AI Engineer',
        company: 'Neuroxyte',
        location: 'Narayanganj, Dhaka Division, Bangladesh',
        period: 'July 2026 – Present',
        type: 'Full-time',
        current: true,
        bullets: [
          'Develop and deploy enterprise AI solutions using Generative AI, LLMs, RAG, and intelligent workflow automation.',
          'Build and scale high-throughput backend services and REST APIs using Python and FastAPI.',
          'Design agentic LLM-based workflows, conversational AI systems, and retrieval-augmented applications.',
          'Integrate multi-modal AI models, external APIs, and cloud services to deliver resilient, end-to-end production pipelines.'
        ]
      },
      {
        role: 'AI Engineer',
        company: 'Softvence Agency',
        location: 'Dhaka, Bangladesh',
        period: 'Feb 2026 – July 2026',
        type: 'Full-time',
        current: false,
        bullets: [
          'Developed citation-aware RAG chatbots using Large Language Models for intelligent organizational question answering.',
          'Engineered FastAPI backend microservices and integrated AI inference models with external APIs.',
          'Built Text-to-Speech (TTS) and voice generation systems for interactive, human-like voice AI interfaces.',
          'Automated complex enterprise business workflows using n8n and implemented specialized Generative AI tools.'
        ]
      }
    ],

    publications: [
      {
        title: 'MangoStack: A Lightweight, Interpretable Ensemble for Real-Time Mango Leaf Disease Diagnosis',
        authors: 'Raiyan Gani, Yusuf Salehin, Md. Shakil Bhuiyan, Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Shamim Ripon',
        conference: '2025 28th International Conference on Computer and Information Technology (ICCIT)',
        publisher: 'IEEE',
        pages: 'pp. 2235–2240',
        year: '2025',
        doi: '10.1109/ICCIT68739.2025.11490181',
        url: 'https://doi.org/10.1109/ICCIT68739.2025.11490181',
        tag: 'Agricultural AI & Vision'
      },
      {
        title: 'Uncertainty-Aware Chest Pathology Detection with Vision and Language Transformers',
        authors: 'Shah Abdul Mazid, Monisha Bani Nibedita Shuci, Mahia Mehrun Safa, Md. Ashikur Rahman Anik, Md. Omor Faruk Sejan, Khandhakar Shatu Moni, Md. Sazzad Hossain, Md. Adnan Morshed, Ahmed Wasif Reza',
        conference: 'Innovations in Data Analytics (ICIDA 2026)',
        publisher: 'Springer Nature',
        pages: 'pp. 397–417',
        year: '2026',
        doi: '10.1007/978-3-032-27845-6_34',
        url: 'https://doi.org/10.1007/978-3-032-27845-6_34',
        tag: 'Medical Imaging & Transformers'
      }
    ],

    projects: [
      {
        name: 'Nexus Intelligence',
        subtitle: 'Enterprise Multi-Agent AI Platform',
        description: 'Full-stack enterprise AI platform for secure question answering and intelligence across private documents, spreadsheets, and web data. Features multi-agent routing, Pinecone vector search, feedback memory, JWT authentication, and automated PII sanitization.',
        tech: ['FastAPI', 'Next.js', 'React', 'TypeScript', 'OpenAI', 'Pinecone', 'AWS'],
        github: 'https://github.com/Shah-Abdul-Mazid',
        badge: 'Enterprise Platform'
      },
      {
        name: 'HRPolicies RAG Chatbot',
        subtitle: 'AI-Powered Citation-Aware Document Q&A',
        description: 'Citation-aware RAG chatbot designed for answering HR policy queries from institutional PDF repositories. Implemented PDF chunking/ingestion, semantic vector search, and LLM response generation with strict source-grounded answers.',
        tech: ['Python', 'FastAPI', 'Streamlit', 'Pinecone', 'Llama 2', 'Sentence Transformers'],
        github: 'https://github.com/Shah-Abdul-Mazid',
        badge: 'GenAI & RAG'
      },
      {
        name: 'Bangladesh Traffic Flow Dataset & Detection',
        subtitle: 'Deep Learning Vehicle Classification & Analysis',
        description: 'Computer vision vehicle detection and classification system trained for real-world Bangladesh traffic conditions. Features YOLO-based detection with Grad-CAM and EigenCAM model interpretability and live video inference.',
        tech: ['PyTorch', 'YOLO', 'OpenCV', 'NumPy', 'Pandas', 'Streamlit', 'Gradio'],
        github: 'https://github.com/Shah-Abdul-Mazid',
        badge: 'Computer Vision'
      },
      {
        name: 'Brain Tumor Detection & Classification',
        subtitle: 'MobDenseNet with CBAM Attention on Brain MRI',
        description: 'Hybrid MobileNetV2–DenseNet121 architecture enhanced with Convolutional Block Attention Module (CBAM) for MRI-based brain tumor classification. Applied patient-level cross-validation and Grad-CAM visual explanations.',
        tech: ['PyTorch', 'MobileNetV2', 'DenseNet121', 'CBAM', 'Grad-CAM', 'Streamlit'],
        github: 'https://github.com/Shah-Abdul-Mazid',
        badge: 'Healthcare AI'
      },
      {
        name: 'WhatsUpIn',
        subtitle: 'AI-Powered Autonomous Travel Itinerary Engine',
        description: 'Personalized AI travel itinerary generator and workflow automation engine. Orchestrates OpenAI reasoning, n8n webhook pipelines, Google Maps, Google Sheets, and Stripe for end-to-end trip creation and booking operations.',
        tech: ['OpenAI', 'n8n', 'Google Maps', 'Google Sheets', 'Stripe', 'REST APIs'],
        github: 'https://github.com/Shah-Abdul-Mazid',
        badge: 'Agentic Workflow'
      }
    ],

    skillCategories: [
      {
        category: 'Programming Languages',
        items: ['Python', 'Java', 'C / C++', 'JavaScript', 'TypeScript', 'SQL']
      },
      {
        category: 'Generative AI & Agentic Systems',
        items: ['Generative AI', 'LLMs', 'Retrieval-Augmented Generation (RAG)', 'Prompt Engineering', 'AI Agents', 'Agentic AI', 'Multi-Agent Systems']
      },
      {
        category: 'Natural Language Processing (NLP)',
        items: ['Natural Language Processing', 'Semantic Search', 'Vector Search', 'Embeddings', 'SentenceTransformers', 'Document Q&A', 'AI Chatbots']
      },
      {
        category: 'Computer Vision & Deep Learning',
        items: ['Object Detection', 'Image Classification', 'Medical Imaging', 'YOLO', 'OpenCV', 'Grad-CAM', 'CBAM Attention']
      },
      {
        category: 'AI & Data Frameworks',
        items: ['PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Plotly']
      },
      {
        category: 'Backend & APIs',
        items: ['FastAPI', 'REST APIs', 'JWT Authentication', 'API Integration', 'PDF Processing & Extraction']
      },
      {
        category: 'Frontend & UIs',
        items: ['React', 'Next.js', 'Streamlit', 'Gradio', 'Tailwind CSS']
      },
      {
        category: 'Databases & Vector Stores',
        items: ['Pinecone', 'Vector Databases', 'MongoDB', 'MySQL', 'SQLite', 'Weaviate', 'Chroma', 'FAISS']
      },
      {
        category: 'Cloud, DevOps & Automation',
        items: ['AWS (EC2, S3)', 'Docker', 'PM2', 'Git / GitHub', 'n8n Workflow Automation', 'Linux / Ubuntu']
      }
    ],

    education: [
      {
        degree: 'B.Sc. in Computer Science & Engineering',
        institution: 'East West University (EWU)',
        major: 'Major : Intelligent System and Data Science',
        period: '2021 – 2026',
        result: 'CGPA 2.56 / 4.00',
        badge: 'Undergraduate'
      },
      {
        degree: 'Higher Secondary Certificate (H.S.C)',
        institution: 'Dhaka Ideal College (Dhaka Board)',
        major: 'Group: Science',
        period: '2018 – 2020',
        result: 'GPA 4.08 / 5.00',
        badge: 'Higher Secondary'
      },
      {
        degree: 'Secondary School Certificate (S.S.C)',
        institution: 'Badshah Faisal Institute (Dhaka Board)',
        major: 'Group: Science',
        period: '2016 – 2018',
        result: 'GPA 4.00 / 5.00',
        badge: 'Secondary'
      }
    ],

    certifications: [
      'IBM Deep Learning with PyTorch, Keras and TensorFlow',
      'DeepLearning.AI TensorFlow Developer',
      'IBM Machine Learning Professional',
      'IBM RAG and Agentic AI',
      'Building AI Agents and Agentic Workflows',
      'IBM AI Developer',
      'AWS Generative AI and AI Agents with Amazon Bedrock',
      'IBM AI Engineering Professional Certificate',
      'IBM Data Science Professional'
    ],

    awards: [
      { name: 'Network War Champion / Finalist', org: 'EWU Telecommunication Club', year: '2024' },
      { name: 'IT Olympiad Participant / Winner', org: 'CSE FEST, East West University', year: '2024' }
    ],

    references: [
      {
        name: 'Dr. Mohammad Rifat Ahmed Rashid',
        role: 'Associate Professor',
        institution: 'East West University',
        email: 'rifat.rashid@ewubd.edu'
      },
      {
        name: 'Dr. Raihan Ul Islam',
        role: 'Associate Professor',
        institution: 'East West University',
        email: 'raihan.islam@ewubd.edu'
      },
      {
        name: 'Dr. Md. Atiqur Rahman',
        role: 'Assistant Professor (Thesis Supervisor)',
        institution: 'East West University',
        email: 'atiqur.rahman@ewubd.edu'
      }
    ],

    languages: [
      { name: 'Bengali', level: 'Native / Bilingual' },
      { name: 'English', level: 'Professional Working Proficiency' }
    ],

    researchInterests: [
      'Generative AI & LLMs',
      'Retrieval-Augmented Generation (RAG)',
      'Multi-Agent AI Systems',
      'Healthcare AI & Medical Imaging',
      'Computer Vision & Object Detection',
      'Natural Language Processing',
      'Intelligent Recommendation Engines',
      'Model Interpretability (Grad-CAM, Attention)'
    ]
  };

  const handleCopyCvId = () => {
    navigator.clipboard.writeText(profile.cvId);
    setCopiedCvId(true);
    setTimeout(() => setCopiedCvId(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6 w-full max-w-full pb-10 text-left">
        <div className="card p-6 sm:p-8 rounded-3xl bg-[#141224] border border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-600/30 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
              >
                {user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'GC'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.full_name || 'Guest Candidate'}</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                    {user?.role === 'user' ? 'Candidate Account' : 'Guest Account'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{user?.email || 'guest@careertrack.bd'}</p>
                {user?.phone && <p className="text-[11px] font-mono text-zinc-500">{user.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-[#121020] border border-dashed border-zinc-800 text-center space-y-4 max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">No Applications or CV Records Synced</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              You haven't submitted any job applications yet. All candidate data remains empty until you add an application or upload an application PDF.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Candidate Privacy: Isolated &amp; Empty</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full pb-10">

      {/* ── Candidate Executive Header Banner ── */}
      <div className="card p-5 sm:p-7 relative overflow-hidden bg-gradient-to-r from-[#17142b] via-[#141224] to-[#100f1c] border border-purple-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-0.5 shadow-lg shadow-purple-600/30 flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#110f1e] flex items-center justify-center text-white font-extrabold text-2xl tracking-tight">
                SM
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs sm:text-sm font-bengali text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                  {profile.banglaName}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <BadgeCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Candidate
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
                {profile.title}
              </p>

              <p className="text-xs sm:text-sm text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> {profile.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {profile.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> {profile.email}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons & CV ID Pill */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
            <button
              onClick={handleCopyCvId}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 flex items-center gap-2 transition-all shadow-sm active:scale-95"
              title="Click to copy Bangladesh Bank CV ID"
            >
              {copiedCvId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
              <span>{copiedCvId ? 'Copied CV ID!' : `CV ID: #${profile.cvId}`}</span>
            </button>

            <button
              onClick={handleCopyEmail}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-2 transition-all active:scale-95"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-zinc-400" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>

        {/* Academic & Professional Social Links Row */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Profiles:
          </span>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 flex items-center gap-1.5 transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
            GitHub
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
          <a
            href={profile.links.orcid}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ORCID ID
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
          <a
            href={profile.links.researchgate}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            ResearchGate
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
          <a
            href={profile.links.scholar}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-950/30 hover:bg-blue-900/40 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            Google Scholar
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            LinkedIn
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
          <a
            href={profile.links.portfolio}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Portfolio
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* ── Key Highlights Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {profile.highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl border border-zinc-800 bg-[#12111e] flex items-start gap-3.5 hover:border-purple-500/40 transition-all shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${h.color}15`, color: h.color, border: `1px solid ${h.color}30` }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${(h as any).isDegree ? 'text-xs sm:text-sm font-bold' : 'text-lg sm:text-xl font-extrabold font-mono'} text-white leading-snug`}>
                  {h.value}
                </p>
                {h.label && (
                  <p className="text-xs font-bold text-zinc-200 mt-0.5 truncate">{h.label}</p>
                )}
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug font-medium">{h.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Layout: Left Sidebar Profile & Right Detail Panes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column (4 cols): Identification, Verification & Details ── */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Government / BB eRecruitment Verification Box */}
          <div className="card p-5 space-y-4 bg-[#12111d] border border-zinc-800">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                BB eRecruitment Record
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">CV Tracking ID</span>
                <span className="text-purple-300 font-mono font-bold text-sm block">#{profile.cvId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">National ID (NID)</span>
                <span className="text-zinc-200 font-mono font-bold block">{profile.nid}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Father's Name</span>
                <span className="text-zinc-200 font-medium block">{profile.father}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Mother's Name</span>
                <span className="text-zinc-200 font-medium block">{profile.mother}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Date of Birth (Age)</span>
                <span className="text-zinc-200 block">{profile.dob}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Permanent Address</span>
                <span className="text-zinc-300 leading-snug block">{profile.address}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>Verified with Bangladesh Bank eRecruitment System</span>
            </div>
          </div>

          {/* Languages */}
          <div className="card p-5 space-y-3 bg-[#12111d] border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Languages
            </h3>
            <div className="space-y-2 text-xs">
              {profile.languages.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="font-bold text-white">{l.name}</span>
                  <span className="text-[11px] text-zinc-400">{l.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Engineering Interests */}
          <div className="card p-5 space-y-3 bg-[#12111d] border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Research &amp; Engineering Focus
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.researchInterests.map((item, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-950/30 border border-purple-500/20 text-purple-200 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Academic References */}
          <div className="card p-5 space-y-3 bg-[#12111d] border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Academic References
            </h3>
            <div className="space-y-3 text-xs">
              {profile.references.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-0.5">
                  <p className="font-bold text-white text-xs">{r.name}</p>
                  <p className="text-[11px] text-zinc-400">{r.role} · {r.institution}</p>
                  <a href={`mailto:${r.email}`} className="text-[11px] text-purple-400 hover:underline font-mono block pt-0.5">
                    {r.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Column (8 cols): Experience, Projects, Publications, Skills, Education ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Professional Summary */}
          <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Professional Summary</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {profile.summary}
            </p>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#12111d] border border-zinc-800">
            {[
              { id: 'overview' as const, label: 'Full Profile', icon: Layers },
              { id: 'experience' as const, label: 'Work Experience', icon: Briefcase },
              { id: 'projects' as const, label: 'Selected Projects', icon: FolderGit2 },
              { id: 'publications' as const, label: 'Publications', icon: BookOpen },
              { id: 'skills' as const, label: 'Technical Skills', icon: Code2 },
              { id: 'education' as const, label: 'Education & Honors', icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Professional Experience ── */}
          {(activeTab === 'overview' || activeTab === 'experience') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  Professional Experience
                </h3>
                <span className="text-[11px] text-zinc-500">Industry &amp; Research</span>
              </div>

              <div className="space-y-6">
                {profile.experience.map((job, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-purple-500/30 space-y-2">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#12111d]" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{job.role}</span>
                          {job.current && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Current Role
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-purple-300 font-semibold">{job.company} · <span className="text-zinc-400 font-normal">{job.location}</span></p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 font-medium sm:text-right">
                        {job.period}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-zinc-300 pt-1">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Selected Projects ── */}
          {(activeTab === 'overview' || activeTab === 'projects') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  Selected Engineering Projects
                </h3>
                <span className="text-[11px] text-zinc-500">5 High-Impact Systems</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-purple-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {proj.badge}
                          </span>
                        </div>
                        <p className="text-xs text-purple-300 font-medium">{proj.subtitle}</p>
                      </div>
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start sm:self-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Peer-Reviewed Publications ── */}
          {(activeTab === 'overview' || activeTab === 'publications') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Peer-Reviewed Research Publications
                </h3>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  IEEE &amp; Springer
                </span>
              </div>

              <div className="space-y-4">
                {profile.publications.map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-zinc-900/50 to-transparent border border-emerald-500/30 space-y-2 hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {pub.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug pt-1">
                          {pub.title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 flex-shrink-0">
                        {pub.publisher} · {pub.year}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-300">Authors:</strong> {pub.authors}
                    </p>

                    <p className="text-xs text-zinc-300 font-medium">
                      <em>{pub.conference}</em>, {pub.publisher}, {pub.pages}.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20">
                      <span className="text-[11px] font-mono text-zinc-400">
                        DOI: <span className="text-emerald-300">{pub.doi}</span>
                      </span>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors flex items-center gap-1.5"
                      >
                        <span>View Publication Notice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Technical Skills Matrix ── */}
          {(activeTab === 'overview' || activeTab === 'skills') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  Comprehensive Technical Competencies
                </h3>
                <span className="text-[11px] text-zinc-500">Officer (IT) &amp; AI Engineer Standard</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.skillCategories.map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {cat.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700/60 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Educational Background ── */}
          {(activeTab === 'overview' || activeTab === 'education') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  Educational Qualifications
                </h3>
                <span className="text-[11px] text-zinc-500">Graduation &amp; Board Results</span>
              </div>

              <div className="space-y-3.5">
                {profile.education.map((deg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{deg.degree}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {deg.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{deg.institution}</p>
                      <p className="text-xs text-purple-300 font-semibold">{deg.major}</p>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                      <span className="text-sm font-mono font-bold text-emerald-400">{deg.result}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">Passing Year: {deg.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Certifications & Honors ── */}
          {(activeTab === 'overview' || activeTab === 'education') && (
            <div className="card p-6 bg-[#12111d] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Professional Certifications &amp; Awards
                </h3>
                <span className="text-[11px] text-zinc-500">17+ Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-200"
                  >
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="font-medium leading-snug">{cert}</span>
                  </div>
                ))}
              </div>

              {/* Competitions */}
              <div className="pt-3 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Competitions &amp; Honors</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {profile.awards.map((a, i) => (
                    <div key={i} className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                      <p className="font-bold text-white">{a.name}</p>
                      <p className="text-[11px] text-zinc-400">{a.org} · {a.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

function BadgeCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
