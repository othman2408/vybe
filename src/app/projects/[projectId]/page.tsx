interface props {
  params: Promise<{
    projectId: string;
  }>;
}
export default async function page({ params }: props) {
  const { projectId } = await params;

  return <div>Project id: {projectId}</div>;
}
