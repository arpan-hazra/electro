// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ComponentsSection from './components/ComponentsSection';
import Workbench3D from './components/Workbench3D';
import ProjectsSection from './components/ProjectsSection';
import RobotGallery from './components/RobotGallery';
import ComponentLearningSection from './components/ComponentLearningSection';
import CreatorSection from './components/CreatorSection';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

// Modals
import ComponentDetailModal from './components/ComponentDetailModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import RobotGalleryModal from './components/RobotGalleryModal';
import CreatorModal from './components/CreatorModal';
import UserProfileModal from './components/UserProfileModal';
import AuthModal from './components/AuthModal';
import ArpanAIAssistant from './components/ArpanAIAssistant';

import { ELECTRONIC_COMPONENTS } from './data/componentsData';
import { QUARTZ_ARPAN_PROJECTS } from './data/projectsData';
import { ROBOT_GALLERY } from './data/robotGalleryData';

export default function App() {
  const [activeSection, setActiveSection] = useState('components');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item modals
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRobot, setSelectedRobot] = useState(null);

  // Creator & User modals
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Smooth navigation handler
  const handleNavigateSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cross-reference navigation from project modal to component modal
  const handleSelectComponentById = (componentId) => {
    const comp = ELECTRONIC_COMPONENTS.find((c) => c.id === componentId);
    if (comp) {
      setSelectedComponent(comp);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={handleNavigateSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreator={() => setCreatorModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1 flex flex-col">
        {/* Hero Banner with 3D Model Switcher */}
        <HeroSection
          onExploreComponents={() => handleNavigateSection('components')}
          onLaunchWorkbench={() => handleNavigateSection('workbench')}
          onExploreProjects={() => handleNavigateSection('projects')}
          onExploreRobots={() => handleNavigateSection('robots')}
          onExploreVideos={() => handleNavigateSection('learning')}
        />

        {/* 3D Workbench Interactive Sandbox */}
        <section id="workbench-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Workbench3D />
        </section>

        {/* Electronic Components 3D Library */}
        <ComponentsSection
          searchQuery={searchQuery}
          onSelectComponent={(comp) => setSelectedComponent(comp)}
        />

        {/* Video Masterclass & Component Theory Hub (Resistors, Diodes, Inductors, YouTube) */}
        <ComponentLearningSection
          onSelect3DModel={handleSelectComponentById}
        />

        {/* Quartz Arpan Project Suite */}
        <ProjectsSection
          onSelectProject={(proj) => setSelectedProject(proj)}
          onSelectComponent={handleSelectComponentById}
        />

        {/* High-Tech Robot Pictures & Gallery */}
        <RobotGallery
          onSelectRobot={(robot) => setSelectedRobot(robot)}
        />

        {/* Creator Spotlight Section featuring Arpan */}
        <CreatorSection
          onOpenCreatorModal={() => setCreatorModalOpen(true)}
        />
      </main>

      {/* Global Footer */}
      <Footer
        onOpenCreator={() => setCreatorModalOpen(true)}
        onSelectSection={handleNavigateSection}
      />

      {/* Interactive Modals */}
      <ComponentDetailModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectComponent={handleSelectComponentById}
      />

      <RobotGalleryModal
        robot={selectedRobot}
        onClose={() => setSelectedRobot(null)}
      />

      <CreatorModal
        isOpen={creatorModalOpen}
        onClose={() => setCreatorModalOpen(false)}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSelectComponent={(c) => setSelectedComponent(c)}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      <AuthModal />

      {/* Intelligent AI Assistant - Made by Arpan */}
      <ArpanAIAssistant
        onSelectComponent={(c) => setSelectedComponent(c)}
        onSelectProject={(p) => setSelectedProject(p)}
        onSelectRobot={(r) => setSelectedRobot(r)}
        onOpenSection={handleNavigateSection}
      />

      {/* Touch-Optimized Mobile Navigation Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={handleNavigateSection}
        onOpenProfile={() => setProfileModalOpen(true)}
      />
    </div>
  );
}
