'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Printer } from 'lucide-react';

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    skills: '',
  });

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      personal: { ...formData.personal, [e.target.name]: e.target.value }
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: '', degree: '', year: '' }]
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...formData.education];
    newEdu.splice(index, 1);
    setFormData({ ...formData, education: newEdu });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', duration: '', description: '' }]
    });
  };

  const removeExperience = (index: number) => {
    const newExp = [...formData.experience];
    newExp.splice(index, 1);
    setFormData({ ...formData, experience: newExp });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 p-4">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-slate-900">Resume Builder</h1>
        <button 
          onClick={handlePrint} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={18} /> Print / Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6 print:hidden">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input name="fullName" value={formData.personal.fullName} onChange={handlePersonalChange} placeholder="John Doe" className="w-full border rounded-md p-2" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input name="email" value={formData.personal.email} onChange={handlePersonalChange} placeholder="john@example.com" className="w-full border rounded-md p-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Phone</label>
                <input name="phone" value={formData.personal.phone} onChange={handlePersonalChange} placeholder="+91 9876543210" className="w-full border rounded-md p-2" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Location</label>
                <input name="location" value={formData.personal.location} onChange={handlePersonalChange} placeholder="New Delhi, India" className="w-full border rounded-md p-2" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Professional Summary</label>
              <textarea name="summary" value={formData.personal.summary} onChange={handlePersonalChange} placeholder="Briefly describe your goals..." className="w-full border rounded-md p-2 min-h-[100px]" />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Education</h2>
              <button onClick={addEducation} className="p-1 hover:bg-slate-100 rounded border"><Plus size={18} /></button>
            </div>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-3 relative">
                <button className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded" onClick={() => removeEducation(idx)}><Trash2 size={16} /></button>
                <input placeholder="School/University" value={edu.school} className="w-full border rounded-md p-2" onChange={(e) => {
                  const newEdu = [...formData.education];
                  newEdu[idx].school = e.target.value;
                  setFormData({...formData, education: newEdu});
                }} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Degree" value={edu.degree} className="w-full border rounded-md p-2" onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[idx].degree = e.target.value;
                    setFormData({...formData, education: newEdu});
                  }} />
                  <input placeholder="Year" value={edu.year} className="w-full border rounded-md p-2" onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[idx].year = e.target.value;
                    setFormData({...formData, education: newEdu});
                  }} />
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Experience</h2>
              <button onClick={addExperience} className="p-1 hover:bg-slate-100 rounded border"><Plus size={18} /></button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-3 relative">
                <button className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded" onClick={() => removeExperience(idx)}><Trash2 size={16} /></button>
                <input placeholder="Company" value={exp.company} className="w-full border rounded-md p-2" onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].company = e.target.value;
                  setFormData({...formData, experience: newExp});
                }} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Role" value={exp.role} className="w-full border rounded-md p-2" onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[idx].role = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} />
                  <input placeholder="Duration" value={exp.duration} className="w-full border rounded-md p-2" onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[idx].duration = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} />
                </div>
                <textarea placeholder="Description" value={exp.description} className="w-full border rounded-md p-2 min-h-[80px]" onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].description = e.target.value;
                  setFormData({...formData, experience: newExp});
                }} />
              </div>
            ))}
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Skills</h2>
            <textarea 
              placeholder="React, Next.js, SQL..." 
              value={formData.skills} 
              className="w-full border rounded-md p-2 min-h-[100px]"
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </section>
        </div>

        {/* Preview Section */}
        <div id="resume-preview" className="bg-white shadow-2xl rounded-xl min-h-[1000px] p-12 text-slate-800 font-serif border border-slate-200">
          <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
            <h2 className="text-4xl font-bold uppercase tracking-wider text-slate-900">{formData.personal.fullName || 'YOUR NAME'}</h2>
            <div className="text-sm mt-2 text-slate-600 flex justify-center gap-4">
              {formData.personal.email && <span>{formData.personal.email}</span>}
              {formData.personal.phone && <span>{formData.personal.phone}</span>}
              {formData.personal.location && <span>{formData.personal.location}</span>}
            </div>
          </div>

          {formData.personal.summary && (
            <div className="mb-8">
              <h3 className="text-lg font-bold border-b border-slate-900 mb-2 uppercase tracking-wide">Professional Summary</h3>
              <p className="text-sm leading-relaxed">{formData.personal.summary}</p>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-slate-900 mb-2 uppercase tracking-wide">Education</h3>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="mb-3 flex justify-between">
                <div>
                  <h4 className="font-bold text-sm">{edu.school || 'University Name'}</h4>
                  <p className="text-xs italic">{edu.degree || 'Degree'}</p>
                </div>
                <div className="text-xs font-bold">{edu.year || 'Year'}</div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-slate-900 mb-2 uppercase tracking-wide">Work Experience</h3>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm">{exp.role || 'Job Title'}</h4>
                    <p className="text-xs italic">{exp.company || 'Company Name'}</p>
                  </div>
                  <div className="text-xs font-bold">{exp.duration || 'Duration'}</div>
                </div>
                <p className="text-xs mt-2 whitespace-pre-line leading-normal">{exp.description}</p>
              </div>
            ))}
          </div>

          {formData.skills && (
            <div>
              <h3 className="text-lg font-bold border-b border-slate-900 mb-2 uppercase tracking-wide">Skills</h3>
              <p className="text-sm">{formData.skills}</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          nav, header, footer, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #resume-preview {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 2cm !important;
            z-index: 9999;
            visibility: visible !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
