"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  User, Briefcase, GraduationCap, Code, FolderGit, 
  Plus, Trash2, Download, RefreshCw, Layout, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  year: string;
  details: string;
}

interface Project {
  title: string;
  description: string;
  link: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

const DEFAULT_RESUME: ResumeData = {
  name: "John Doe",
  title: "Senior Full Stack Engineer",
  email: "john.doe@example.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "www.johndoe.dev",
  summary: "Experienced software engineer specializing in building high-performance scalable web applications. Proficient in React, Next.js, Node.js, and cloud architectures with 5+ years of driving system efficiency.",
  skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker", "Tailwind CSS", "GraphQL"],
  experience: [
    {
      company: "TechNova Solutions",
      position: "Senior Software Engineer",
      startDate: "2023",
      endDate: "Present",
      description: "Led development of a cloud-native SaaS dashboard, increasing page response speeds by 40% and overseeing a team of 4 junior developers."
    },
    {
      company: "InnovateLabs",
      position: "Full Stack Developer",
      startDate: "2021",
      endDate: "2023",
      description: "Built responsive frontend UI features using React and Next.js, and integrated payment gateways like Stripe and Razorpay."
    }
  ],
  education: [
    {
      school: "Stanford University",
      degree: "B.S. in Computer Science",
      year: "2017 - 2021",
      details: "Specialized in Software Engineering and Database Systems. GPA: 3.8/4.0"
    }
  ],
  projects: [
    {
      title: "TaskFlow Manager",
      description: "A collaborative project management application with real-time drag-and-drop boards and team analytics integrations.",
      link: "github.com/johndoe/taskflow"
    }
  ]
};

export function ResumeBuilderWorkspace() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [template, setTemplate] = useState<"violet" | "classic" | "slate">("violet");
  const [newSkill, setNewSkill] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);

  // Experience handlers
  const handleAddExperience = () => {
    setData({
      ...data,
      experience: [
        ...data.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "" }
      ]
    });
  };

  const handleUpdateExperience = (idx: number, field: keyof Experience, value: string) => {
    const updated = data.experience.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp);
    setData({ ...data, experience: updated });
  };

  const handleDeleteExperience = (idx: number) => {
    setData({ ...data, experience: data.experience.filter((_, i) => i !== idx) });
  };

  // Education handlers
  const handleAddEducation = () => {
    setData({
      ...data,
      education: [
        ...data.education,
        { school: "", degree: "", year: "", details: "" }
      ]
    });
  };

  const handleUpdateEducation = (idx: number, field: keyof Education, value: string) => {
    const updated = data.education.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu);
    setData({ ...data, education: updated });
  };

  const handleDeleteEducation = (idx: number) => {
    setData({ ...data, education: data.education.filter((_, i) => i !== idx) });
  };

  // Project handlers
  const handleAddProject = () => {
    setData({
      ...data,
      projects: [
        ...data.projects,
        { title: "", description: "", link: "" }
      ]
    });
  };

  const handleUpdateProject = (idx: number, field: keyof Project, value: string) => {
    const updated = data.projects.map((proj, i) => i === idx ? { ...proj, [field]: value } : proj);
    setData({ ...data, projects: updated });
  };

  const handleDeleteProject = (idx: number) => {
    setData({ ...data, projects: data.projects.filter((_, i) => i !== idx) });
  };

  // Skill handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData({ ...data, skills: [...data.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setData({ ...data, skills: data.skills.filter(s => s !== skillToDelete) });
  };

  // Download PDF helper
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${data.name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };
      await html2pdf().set(opt).from(previewRef.current).save();
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setData(DEFAULT_RESUME);
  };

  return (
    <div className="space-y-6">
      {/* Control Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setActiveTab("edit")}
            className={`text-xs px-4 py-2 rounded-md font-medium transition-all ${activeTab === "edit" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Edit Form
          </button>
          <button 
            onClick={() => setActiveTab("preview")}
            className={`text-xs px-4 py-2 rounded-md font-medium transition-all ${activeTab === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <Eye className="inline mr-1 h-3.5 w-3.5" /> Live Preview
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Layout size={14} className="text-slate-400" />
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value as any)}
              className="bg-transparent border-0 text-xs text-white focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="violet">Modern Violet</option>
              <option value="classic">Corporate Classic</option>
              <option value="slate">Minimalist Slate</option>
            </select>
          </div>

          <Button size="sm" onClick={handleDownloadPdf} disabled={isDownloading} className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg">
            <Download size={14} className="mr-1" /> {isDownloading ? "Generating..." : "Download PDF"}
          </Button>

          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleReset}>
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form view */}
        {activeTab === "edit" ? (
          <div className="lg:col-span-7 space-y-6">
            {/* Personal Details */}
            <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <User className="text-violet-500 h-5 w-5" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Full Name</label>
                  <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Professional Title</label>
                  <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Email Address</label>
                  <Input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Phone Number</label>
                  <Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Location (City, Country)</label>
                  <Input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Website / Portfolio</label>
                  <Input value={data.website} onChange={(e) => setData({ ...data, website: e.target.value })} className="bg-slate-950 border-slate-800" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Professional Summary</label>
                <textarea 
                  value={data.summary} 
                  onChange={(e) => setData({ ...data, summary: e.target.value })} 
                  className="w-full min-h-[80px] p-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </Card>

            {/* Experience */}
            <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="text-violet-500 h-5 w-5" />
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8" onClick={handleAddExperience}>
                  <Plus size={14} className="mr-1" /> Add Job
                </Button>
              </div>

              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 relative">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-rose-500 absolute top-2 right-2 hover:bg-rose-500/10" onClick={() => handleDeleteExperience(idx)}>
                      <Trash2 size={14} />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Company Name</label>
                        <Input value={exp.company} onChange={(e) => handleUpdateExperience(idx, "company", e.target.value)} className="bg-slate-950 border-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Job Title</label>
                        <Input value={exp.position} onChange={(e) => handleUpdateExperience(idx, "position", e.target.value)} className="bg-slate-950 border-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Start Date</label>
                        <Input value={exp.startDate} onChange={(e) => handleUpdateExperience(idx, "startDate", e.target.value)} className="bg-slate-950 border-slate-800" placeholder="e.g. 2021" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">End Date</label>
                        <Input value={exp.endDate} onChange={(e) => handleUpdateExperience(idx, "endDate", e.target.value)} className="bg-slate-950 border-slate-800" placeholder="e.g. Present" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Responsibilities / Description</label>
                      <textarea 
                        value={exp.description} 
                        onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)} 
                        className="w-full min-h-[60px] p-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="text-violet-500 h-5 w-5" />
                  <h3 className="text-lg font-semibold">Education</h3>
                </div>
                <Button size="sm" variant="outline" className="h-8" onClick={handleAddEducation}>
                  <Plus size={14} className="mr-1" /> Add School
                </Button>
              </div>

              <div className="space-y-6">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="space-y-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 relative">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-rose-500 absolute top-2 right-2 hover:bg-rose-500/10" onClick={() => handleDeleteEducation(idx)}>
                      <Trash2 size={14} />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">School / University</label>
                        <Input value={edu.school} onChange={(e) => handleUpdateEducation(idx, "school", e.target.value)} className="bg-slate-950 border-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Degree / Study Field</label>
                        <Input value={edu.degree} onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)} className="bg-slate-950 border-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Dates / Year</label>
                        <Input value={edu.year} onChange={(e) => handleUpdateEducation(idx, "year", e.target.value)} className="bg-slate-950 border-slate-800" placeholder="e.g. 2017 - 2021" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Additional Details / GPA</label>
                        <Input value={edu.details} onChange={(e) => handleUpdateEducation(idx, "details", e.target.value)} className="bg-slate-950 border-slate-800" placeholder="e.g. GPA 3.8, clubs..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills & Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Code className="text-violet-500 h-5 w-5" />
                  <h3 className="text-lg font-semibold">Skills</h3>
                </div>
                
                <form onSubmit={handleAddSkill} className="flex space-x-2">
                  <Input 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)} 
                    placeholder="Add skill (e.g. Docker)" 
                    className="bg-slate-950 border-slate-800 flex-1 h-9 text-xs" 
                  />
                  <Button type="submit" size="sm" className="h-9 bg-violet-600 hover:bg-violet-500">
                    Add
                  </Button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center space-x-1 text-xs bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full text-violet-400 font-medium">
                      <span>{skill}</span>
                      <button type="button" onClick={() => handleDeleteSkill(skill)} className="text-slate-500 hover:text-rose-500 p-0.5">
                        <Trash2 size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </Card>

              {/* Projects */}
              <Card className="p-6 bg-slate-900 border-slate-800 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <FolderGit className="text-violet-500 h-5 w-5" />
                    <h3 className="text-lg font-semibold">Projects</h3>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleAddProject}>
                    <Plus size={12} className="mr-1" /> Add Project
                  </Button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 border border-slate-800 bg-slate-950/40 rounded-lg relative space-y-2">
                      <Button size="icon" variant="ghost" className="h-5 w-5 text-rose-500 absolute top-1 right-1 hover:bg-rose-500/10" onClick={() => handleDeleteProject(idx)}>
                        <Trash2 size={12} />
                      </Button>
                      <Input 
                        value={proj.title} 
                        onChange={(e) => handleUpdateProject(idx, "title", e.target.value)} 
                        placeholder="Project Title" 
                        className="bg-slate-950 border-slate-850 h-8 text-xs font-semibold" 
                      />
                      <Input 
                        value={proj.link} 
                        onChange={(e) => handleUpdateProject(idx, "link", e.target.value)} 
                        placeholder="Link (e.g. github.com/user/repo)" 
                        className="bg-slate-950 border-slate-850 h-8 text-[11px]" 
                      />
                      <textarea 
                        value={proj.description} 
                        onChange={(e) => handleUpdateProject(idx, "description", e.target.value)} 
                        placeholder="Project description" 
                        className="w-full min-h-[50px] p-2 rounded border border-slate-850 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        {/* Live A4 Print Preview column */}
        <div className={`lg:col-span-5 ${activeTab === "preview" ? "lg:col-span-12 flex justify-center" : ""}`}>
          <div className="sticky top-6 w-full max-w-[210mm] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-white text-slate-800 p-8">
            <div ref={previewRef} className="bg-white" style={{ width: "100%", minHeight: "297mm", fontFamily: "Georgia, serif" }}>
              {/* Template: Modern Violet */}
              {template === "violet" && (
                <div className="space-y-6 text-slate-800">
                  {/* Header Banner */}
                  <div className="border-b-4 border-violet-600 pb-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: "Georgia, serif" }}>{data.name || "Full Name"}</h1>
                    <h2 className="text-lg font-medium text-violet-600 mt-1 uppercase tracking-wider">{data.title || "Job Title"}</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-xs text-slate-600" style={{ fontFamily: "sans-serif" }}>
                      {data.email && <div>✉ {data.email}</div>}
                      {data.phone && <div>📞 {data.phone}</div>}
                      {data.location && <div>📍 {data.location}</div>}
                      {data.website && <div className="col-span-2">🔗 {data.website}</div>}
                    </div>
                  </div>

                  {/* Summary */}
                  {data.summary && (
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed text-slate-700 italic">{data.summary}</p>
                    </div>
                  )}

                  {/* Skills Grid */}
                  {data.skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-violet-700 uppercase tracking-widest border-b border-slate-200 pb-1" style={{ fontFamily: "sans-serif" }}>Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-medium" style={{ fontFamily: "sans-serif" }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {data.experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-violet-700 uppercase tracking-widest border-b border-slate-200 pb-1" style={{ fontFamily: "sans-serif" }}>Experience</h3>
                      <div className="space-y-4">
                        {data.experience.map((exp, idx) => (exp.company || exp.position) && (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-start text-sm">
                              <span className="font-bold text-slate-900">{exp.position}</span>
                              <span className="text-xs text-slate-500" style={{ fontFamily: "sans-serif" }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-xs text-violet-600 font-semibold uppercase tracking-wider">{exp.company}</div>
                            <p className="text-xs text-slate-700 leading-relaxed mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {data.education.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-violet-700 uppercase tracking-widest border-b border-slate-200 pb-1" style={{ fontFamily: "sans-serif" }}>Education</h3>
                      <div className="space-y-3">
                        {data.education.map((edu, idx) => edu.school && (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900 text-sm">
                              <span>{edu.degree}</span>
                              <span className="text-xs text-slate-500 font-normal" style={{ fontFamily: "sans-serif" }}>{edu.year}</span>
                            </div>
                            <div className="text-slate-700 italic">{edu.school}</div>
                            {edu.details && <div className="text-slate-600 mt-0.5">{edu.details}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {data.projects.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-violet-700 uppercase tracking-widest border-b border-slate-200 pb-1" style={{ fontFamily: "sans-serif" }}>Projects</h3>
                      <div className="space-y-3">
                        {data.projects.map((proj, idx) => proj.title && (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900 text-sm">
                              <span>{proj.title}</span>
                              {proj.link && <span className="text-xs text-violet-600 font-medium font-sans">{proj.link}</span>}
                            </div>
                            <p className="text-slate-700 mt-1 leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Template: Corporate Classic */}
              {template === "classic" && (
                <div className="grid grid-cols-12 gap-8 text-slate-800">
                  {/* Left Column Sidebar */}
                  <div className="col-span-4 bg-slate-50 p-6 -m-8 mr-0 border-r border-slate-200 min-h-[297mm]">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily: "sans-serif" }}>Contact</h2>
                        <div className="space-y-2 text-xs text-slate-700 leading-relaxed break-all">
                          {data.email && <div>✉ {data.email}</div>}
                          {data.phone && <div>📞 {data.phone}</div>}
                          {data.location && <div>📍 {data.location}</div>}
                          {data.website && <div>🔗 {data.website}</div>}
                        </div>
                      </div>

                      {data.skills.length > 0 && (
                        <div>
                          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily: "sans-serif" }}>Skills</h2>
                          <div className="flex flex-col space-y-2">
                            {data.skills.map((skill, idx) => (
                              <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 text-center font-medium" style={{ fontFamily: "sans-serif" }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column Content */}
                  <div className="col-span-8 space-y-6">
                    <div className="border-b border-slate-300 pb-4">
                      <h1 className="text-4xl font-bold tracking-tight text-slate-900">{data.name || "Full Name"}</h1>
                      <h2 className="text-md font-semibold text-slate-600 mt-1 uppercase tracking-wider">{data.title || "Job Title"}</h2>
                    </div>

                    {data.summary && (
                      <p className="text-xs leading-relaxed text-slate-700">{data.summary}</p>
                    )}

                    {data.experience.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1" style={{ fontFamily: "sans-serif" }}>Experience</h3>
                        <div className="space-y-4">
                          {data.experience.map((exp, idx) => (exp.company || exp.position) && (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-start text-xs">
                                <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                                <span className="text-[10px] text-slate-500 font-sans">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <div className="text-xs font-semibold text-slate-600">{exp.company}</div>
                              <p className="text-[11px] text-slate-700 leading-relaxed mt-1">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.education.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-1" style={{ fontFamily: "sans-serif" }}>Education</h3>
                        <div className="space-y-3">
                          {data.education.map((edu, idx) => edu.school && (
                            <div key={idx} className="text-xs">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{edu.degree}</span>
                                <span className="text-[10px] text-slate-500 font-normal font-sans">{edu.year}</span>
                              </div>
                              <div className="text-slate-700 italic">{edu.school}</div>
                              {edu.details && <div className="text-slate-600 mt-0.5">{edu.details}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Template: Minimalist Slate */}
              {template === "slate" && (
                <div className="space-y-6 text-slate-800">
                  <div className="text-center pb-4 border-b border-slate-200">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{data.name || "Full Name"}</h1>
                    <h2 className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{data.title || "Job Title"}</h2>
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-slate-600 font-sans">
                      {data.email && <span>✉ {data.email}</span>}
                      {data.phone && <span>📞 {data.phone}</span>}
                      {data.location && <span>📍 {data.location}</span>}
                      {data.website && <span>🔗 {data.website}</span>}
                    </div>
                  </div>

                  {data.summary && (
                    <p className="text-xs leading-relaxed text-slate-700 text-center max-w-xl mx-auto italic">{data.summary}</p>
                  )}

                  {data.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Professional Experience</h3>
                      <div className="space-y-3">
                        {data.experience.map((exp, idx) => (exp.company || exp.position) && (
                          <div key={idx} className="grid grid-cols-4 gap-4 text-xs">
                            <div className="col-span-1 text-slate-500 font-sans font-semibold">{exp.startDate} - {exp.endDate}</div>
                            <div className="col-span-3 space-y-1">
                              <div className="font-bold text-slate-900 text-sm">{exp.position} <span className="font-normal text-slate-500">at {exp.company}</span></div>
                              <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Education & Training</h3>
                      <div className="space-y-2">
                        {data.education.map((edu, idx) => edu.school && (
                          <div key={idx} className="grid grid-cols-4 gap-4 text-xs">
                            <div className="col-span-1 text-slate-500 font-sans font-semibold">{edu.year}</div>
                            <div className="col-span-3">
                              <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                              <div className="text-slate-700 italic">{edu.school}</div>
                              {edu.details && <div className="text-slate-600 mt-0.5">{edu.details}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">Key Expertise</h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{data.skills.join(" • ")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
