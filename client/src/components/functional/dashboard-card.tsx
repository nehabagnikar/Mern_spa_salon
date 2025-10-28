function DashboardCard({
  name,
  value,
  description,
}: {
  name: string;
  value: number;
  description: string;
}) {
  return (
    <div className="bg-gray-100 rounded border border-gray-400 p-4 flex flex-col gap-5">
      <h1 className="text-sm font-bold">{name}</h1>
      <h1 className="text-5xl font-bold text-center">{value}</h1>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

export default DashboardCard;
