type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mt-4">
      {children}
    </div>
  );
}
