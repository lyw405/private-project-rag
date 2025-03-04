'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ChatMainLayout from './components/ChatMainLayout/ChatMainLayout';
import { Skeleton } from 'antd';

const Loading = () => (
  <div className="flex flex-col gap-4 px-52 py-4">
    <Skeleton active />
    <Skeleton active />
    <Skeleton active />
  </div>
);

const OpenaiSdk = dynamic(() => import('./pages/openai-sdk'), {
  ssr: false,
  loading: () => <Loading />
});


const projectItems = [
  { label: 'dasComps', key: 'dasComps' },
  { label: 'aasComps', key: 'aasComps' },
];

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type');

  const [selectedProject, setSelectedProject] = useState(
    projectItems.some((item) => item.key === typeFromUrl) ? typeFromUrl! : projectItems[0].key
  );

  const handleProjectChange = (project: string) => {
    const params = new URLSearchParams(searchParams);
    router.push(`${pathname}?${params.toString()}`);
    setSelectedProject(project);
  };

  return (
    <ChatMainLayout
      projectItems={projectItems}
      mainContent={<OpenaiSdk selectedProject={selectedProject}/>}
      selectedProject={selectedProject}
      onProjectChange={handleProjectChange}
    />
  );
};

export default Home;
