export interface ProjectItem {
  label: string;
  key: string;
}

export interface ChatMainLayoutProps {
  mainContent: React.ReactNode;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  projectItems: ProjectItem[];
}
